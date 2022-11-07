import path from "path";
import { PolywrapClient } from "@polywrap/client-js";
import { initTestEnvironment, stopTestEnvironment, providers, ensAddresses } from "@polywrap/test-env-js";
import * as App from "../types/wrap";
import { getPlugins, setupAccounts, setupContractNetworks } from "../utils";
import { Client } from "@polywrap/core-js";
import { Ethereum_TxReceipt, SafeWrapper_SafeTransactionData } from "../types/wrap";
import { Wallet } from "ethers";

jest.setTimeout(1200000);

describe("On-chain signatures", () => {
  let safeAddress: string;

  let client: Client;
  const wrapperPath: string = path.join(path.resolve(__dirname), "..", "..", "..");
  const wrapperUri = `fs/${wrapperPath}/build`;

  const connection = { networkNameOrChainId: "testnet", chainId: 1337 };

  beforeAll(async () => {
    await initTestEnvironment();

    const plugins = await getPlugins(
      providers.ethereum,
      providers.ipfs,
      ensAddresses.ensAddress,
      connection.networkNameOrChainId
    );

    client = new PolywrapClient({
      ...plugins,
    }) as unknown as Client;

    [safeAddress] = await setupContractNetworks(client);

    client = new PolywrapClient({
      ...plugins,
      envs: [
        {
          uri: wrapperUri,
          env: {
            safeAddress: safeAddress,
            connection: connection,
          },
        },
      ],
    }) as unknown as Client;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("approveTransactionHash", () => {
    it("should fail if a transaction hash is approved by an account that is not an owner", async () => {
      const [account1] = setupAccounts();
      // Init client with different signer
      const plugins = await getPlugins(
        providers.ethereum,
        providers.ipfs,
        ensAddresses.ensAddress,
        connection.networkNameOrChainId,
        new Wallet("0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4")
      );

      const client2 = new PolywrapClient({
        ...plugins,
        envs: [
          {
            uri: wrapperUri,
            env: {
              safeAddress: safeAddress,
              connection: connection,
            },
          },
        ],
      });

      const transactionData: SafeWrapper_SafeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x",
      };

      const transactionHashResult = await App.SafeWrapper_Module.getTransactionHash(
        { tx: transactionData },
        client,
        wrapperUri
      );

      //@ts-ignore
      const txHash = transactionHashResult.value;

      const response = await App.SafeWrapper_Module.approveTransactionHash(
        {
          hash: txHash,
        },
        client2 as unknown as Client, // Using client with different signer to try to approve hash
        wrapperUri
      );

      expect(response.ok).toBeFalsy();

      //@ts-ignore
      const error = response.error.toString();
      expect(error).toContain("Transaction hashes can only be approved by Safe owners");
    });

    it("should approve the transaction hash", async () => {
      const [account1] = setupAccounts();

      const transactionData: SafeWrapper_SafeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x",
      };

      const transactionHashResult = await App.SafeWrapper_Module.getTransactionHash(
        { tx: transactionData },
        client,
        wrapperUri
      );

      //@ts-ignore
      const txHash = transactionHashResult.value;

      const response = await App.SafeWrapper_Module.approveTransactionHash(
        {
          hash: txHash,
        },
        client,
        wrapperUri
      );
      expect(response).toBeTruthy();

      //@ts-ignore
      const txReceipt = response.value as Ethereum_TxReceipt;

      expect(txReceipt.transactionHash).toBeTruthy();
      expect(txReceipt.logs.length).toBeGreaterThan(0);
      expect(txReceipt.to.toLowerCase()).toEqual(safeAddress.toLowerCase());

      const approvedHashesResponse = await App.SafeWrapper_Module.approvedHashes({ hash: txHash }, client, wrapperUri);

      //@ts-ignore
      const approvedHashes = approvedHashesResponse.value;

      expect(approvedHashes).toEqual("1");
    });

    it("should ignore a duplicated signatures", async () => {
      const [account1] = setupAccounts();

      const transactionData: SafeWrapper_SafeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x",
      };

      const transactionHashResult = await App.SafeWrapper_Module.getTransactionHash(
        { tx: transactionData },
        client,
        wrapperUri
      );

      //@ts-ignore
      const txHash = transactionHashResult.value;

      await App.SafeWrapper_Module.approveTransactionHash(
        {
          hash: txHash,
        },
        client,
        wrapperUri
      );

      const approvedHashesResponse = await App.SafeWrapper_Module.approvedHashes({ hash: txHash }, client, wrapperUri);

      //@ts-ignore
      const approvedHashes = approvedHashesResponse.value;

      expect(approvedHashes).toEqual("1");

      await App.SafeWrapper_Module.approveTransactionHash(
        {
          hash: txHash,
        },
        client,
        wrapperUri
      );

      const approvedHashesResponse2 = await App.SafeWrapper_Module.approvedHashes({ hash: txHash }, client, wrapperUri);

      //@ts-ignore
      const approvedHashes2 = approvedHashesResponse2.value;

      expect(approvedHashes2).toEqual("1");
    });
  });

  describe("getOwnersWhoApprovedTx", () => {
    it("should return the list of owners who approved a transaction hash", async () => {
      const [account1] = setupAccounts();

      const transactionData: SafeWrapper_SafeTransactionData = {
        to: account1.address,
        value: "700000000000000000", // 0.7 ETH
        data: "0x",
      };

      const transactionHashResult = await App.SafeWrapper_Module.getTransactionHash(
        { tx: transactionData },
        client,
        wrapperUri
      );

      //@ts-ignore
      const txHash = transactionHashResult.value;

      const response = await App.SafeWrapper_Module.approveTransactionHash(
        {
          hash: txHash,
        },
        client,
        wrapperUri
      );

      expect(response).toBeTruthy();

      const approvedHashesResponse = await App.SafeWrapper_Module.getOwnersWhoApprovedTx(
        { hash: txHash },
        client,
        wrapperUri
      );

      //@ts-ignore
      const approvedHashes = approvedHashesResponse.value;

      expect(approvedHashes.length).toEqual(1);
      expect(approvedHashes).toContain(account1.address);

      const plugins = await getPlugins(
        providers.ethereum,
        providers.ipfs,
        ensAddresses.ensAddress,
        connection.networkNameOrChainId,
        new Wallet("0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1")
      );

      const client2 = new PolywrapClient({
        ...plugins,
        envs: [
          {
            uri: wrapperUri,
            env: {
              safeAddress: safeAddress,
              connection: connection,
            },
          },
        ],
      });

      await App.SafeWrapper_Module.approveTransactionHash(
        {
          hash: txHash,
        },
        client2 as unknown as Client, // Using client with different signer to try to approve hash
        wrapperUri
      );

      const approvedHashesResponse2 = await App.SafeWrapper_Module.getOwnersWhoApprovedTx(
        { hash: txHash },
        client,
        wrapperUri
      );

      //@ts-ignore
      const approvedHashes2 = approvedHashesResponse2.value;

      expect(approvedHashes2.length).toEqual(2);
      expect(approvedHashes2).toContain("0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0");
    });
  });
});
