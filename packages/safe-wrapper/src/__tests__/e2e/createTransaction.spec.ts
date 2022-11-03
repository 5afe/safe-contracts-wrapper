import path from "path";
import { PolywrapClient } from "@polywrap/client-js";
import { initTestEnvironment, stopTestEnvironment, providers, ensAddresses } from "@polywrap/test-env-js";
import * as App from "../types/wrap";
import { getPlugins, setupAccounts, setupContractNetworks } from "../utils";
import { Client } from "@polywrap/core-js";
import { SafeWrapper_SafeTransactionData } from "../types/wrap";
import { SafeTransactionData } from "../../wrap";

jest.setTimeout(1200000);

describe("Transactions creation", () => {
  let safeAddress: string;

  let client: Client;
  const wrapperPath: string = path.join(path.resolve(__dirname), "..", "..", "..");
  const wrapperUri = `fs/${wrapperPath}/build`;

  let contractNetworksPart: {
    proxyContractAddress: string;
    safeContractAddress: string;
    multisendAddress: string;
    multisendCallOnlyAddress: string;
  };

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

    [safeAddress, contractNetworksPart] = await setupContractNetworks(client);

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

  describe("standardizeSafeTransactionData", () => {});

  describe("createTransaction", () => {
    it("should create a single transaction with gasPrice=0", async () => {
      const [account1] = setupAccounts();

      const transactionData: SafeWrapper_SafeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x",
        baseGas: "111",
        gasPrice: "0",
        gasToken: "0x333",
        refundReceiver: "0x444",
        nonce: "555",
        safeTxGas: "666",
      };

      const transactionResult = await App.SafeWrapper_Module.createTransaction(
        {
          tx: transactionData,
        },
        client,
        wrapperUri
      );

      expect(transactionResult.ok).toEqual(true);
      //@ts-ignore
      const transaction = transactionResult.value.data;

      expect(transaction).toMatchObject(transactionData);
    });

    it("should create a single transaction with gasPrice>0", async () => {
      const [account1] = setupAccounts();

      const transactionData: SafeWrapper_SafeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x",
        baseGas: "111",
        gasPrice: "222",
        gasToken: "0x333",
        refundReceiver: "0x444",
        nonce: "555",
        safeTxGas: "666",
      };

      const transactionResult = await App.SafeWrapper_Module.createTransaction(
        {
          tx: transactionData,
        },
        client,
        wrapperUri
      );

      expect(transactionResult.ok).toEqual(true);
      //@ts-ignore
      const transaction = transactionResult.value.data;

      expect(transaction).toMatchObject(transactionData);
    });

    it("should create a single transaction when passing a transaction array with length=1", async () => {
      const [account1] = setupAccounts();

      const safeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x00",
      };

      const safeTxArray = [safeTransactionData];

      const wrapperResult = await App.SafeWrapper_Module.createMultiSendTransaction(
        {
          txs: safeTxArray,
          multiSendContractAddress: contractNetworksPart.multisendAddress,
        },
        client,
        wrapperUri
      );

      //@ts-ignore
      const wrapperResultData = wrapperResult.value.data as SafeTransactionData;

      expect(wrapperResultData.to).toEqual(safeTransactionData.to);
      expect(wrapperResultData.value).toEqual(safeTransactionData.value);
      expect(wrapperResultData.data).toEqual(safeTransactionData.data);
    });

    it("should create a single transaction when passing a transaction array with length=1 and options", async () => {
      const [account1] = setupAccounts();

      const safeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x00",
      };

      const safeTxArray = [safeTransactionData];

      const options = {
        baseGas: "111",
        gasPrice: "222",
        gasToken: "0x333",
        refundReceiver: "0x444",
        nonce: "555",
        safeTxGas: "666",
      };

      const wrapperResult = await App.SafeWrapper_Module.createMultiSendTransaction(
        {
          txs: safeTxArray,
          options: options,
          multiSendContractAddress: contractNetworksPart.multisendAddress,
        },
        client,
        wrapperUri
      );

      //@ts-ignore
      const wrapperResultData = wrapperResult.value.data as SafeTransactionData;

      expect(wrapperResultData.to).toEqual(safeTransactionData.to);
      expect(wrapperResultData.value).toEqual(safeTransactionData.value);
      expect(wrapperResultData.data).toEqual(safeTransactionData.data);
      expect(wrapperResultData.baseGas).toEqual(options.baseGas);
      expect(wrapperResultData.gasPrice).toEqual(options.gasPrice);
      expect(wrapperResultData.gasToken).toEqual(options.gasToken);
      expect(wrapperResultData.refundReceiver).toEqual(options.refundReceiver);
      expect(wrapperResultData.nonce).toEqual(options.nonce);
      expect(wrapperResultData.safeTxGas).toEqual(options.safeTxGas);
    });

    it("should fail when creating a MultiSend transaction passing a transaction array with length=0", async () => {
      const multiSendResult = await App.SafeWrapper_Module.createMultiSendTransaction(
        { txs: [], multiSendContractAddress: contractNetworksPart.multisendAddress },
        client,
        wrapperUri
      );

      expect(multiSendResult.ok).toBe(false);
    });

    it("should create a MultiSend transaction", async () => {
      const [account1] = setupAccounts();

      const safeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x00",
      };

      const safeTxArray = [safeTransactionData, safeTransactionData];

      const wrapperResult = await App.SafeWrapper_Module.createMultiSendTransaction(
        {
          txs: safeTxArray,
          multiSendContractAddress: contractNetworksPart.multisendAddress,
        },
        client,
        wrapperUri
      );

      //@ts-ignore
      const wrapperResultData = wrapperResult.value.data as SafeTransactionData;

      expect(wrapperResultData.to).toEqual(contractNetworksPart.multisendAddress);
      expect(wrapperResultData.data).not.toEqual(safeTransactionData.data);
    });

    it("should create a MultiSend transaction with options", async () => {
      const [account1] = setupAccounts();

      const safeTransactionData = {
        to: account1.address,
        value: "500000000000000000", // 0.5 ETH
        data: "0x00",
      };

      const safeTxArray = [safeTransactionData, safeTransactionData];

      const options = {
        baseGas: "111",
        gasPrice: "222",
        gasToken: "0x333",
        refundReceiver: "0x444",
        nonce: "555",
        safeTxGas: "666",
      };

      const wrapperResult = await App.SafeWrapper_Module.createMultiSendTransaction(
        {
          txs: safeTxArray,
          options: options,
          multiSendContractAddress: contractNetworksPart.multisendAddress,
        },
        client,
        wrapperUri
      );

      //@ts-ignore
      const wrapperResultData = wrapperResult.value.data as SafeTransactionData;

      expect(wrapperResultData.to).toEqual(contractNetworksPart.multisendAddress);
      expect(wrapperResultData.data).not.toEqual(safeTransactionData.data);
      expect(wrapperResultData.value).not.toEqual(safeTransactionData.value);

      expect(wrapperResultData.baseGas).toEqual(options.baseGas);
      expect(wrapperResultData.gasPrice).toEqual(options.gasPrice);
      expect(wrapperResultData.gasToken).toEqual(options.gasToken);
      expect(wrapperResultData.refundReceiver).toEqual(options.refundReceiver);
      expect(wrapperResultData.nonce).toEqual(options.nonce);
      expect(wrapperResultData.safeTxGas).toEqual(options.safeTxGas);
    });
  });
});