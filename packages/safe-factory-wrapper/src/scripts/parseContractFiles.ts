import fs from "fs";

const basePath = "./node_modules/@gnosis.pm/safe-deployments/dist/assets";
const requiredContractFilesNames = [
  "gnosis_safe.json",
  "gnosis_safe_l2.json",
  "multi_send.json",
  "multi_send_call_only.json",
  "proxy_factory.json",
];

const savePath = "./src/utils/contractAddresses";

run();

console.log("Contract addressess map generation done");

async function run() {
  const versions = getVersions();

  for (const version of versions) {
    const versionPath = basePath + "/" + version;
    const content = getFolderContents(versionPath);
    const filesToMap = content.filter((file) =>
      requiredContractFilesNames.some((required) => required === file)
    );

    for (const fileName of filesToMap) {
      const filePath = versionPath + "/" + fileName;
      const file = getFile(filePath);
      const networks = getNetworksFromFile(file);
      if (networks) {
        createNetworksFile(version, fileName, networks);
      }
    }
  }
}

function getVersions() {
  return getFolderContents(basePath);
}

function getFile(path: string) {
  return fs.readFileSync(path, { encoding: "utf8" });
}

function getFolderContents(path: string) {
  return fs.readdirSync(path);
}

function createNetworksFile(
  version: string,
  fileName: string,
  networksMap: [string, string][]
) {
  const filePath = savePath + "/" + version.replace("v", "") + "/";
  createFolder(filePath);

  const fileContent = decorateNetworksFileContent(
    JSON.stringify(networksMap, null, 2)
  );

  return createFile(filePath, fileName.replace("json", "ts"), fileContent);
}

function createFile(path: string, fileName: string, content: string | Buffer) {
  return fs.writeFileSync(path.concat(fileName), content);
}

function createFolder(path: string) {
  return fs.mkdirSync(path, { recursive: true });
}

function getNetworksFromFile(file: string): [string, string][] | undefined {
  try {
    const res = JSON.parse(file);
    const addressess = res.networkAddresses;
    return Object.keys(addressess).map((key) => [key, addressess[key]]);
  } catch (e) {
    console.error(e);
  }
  return undefined;
}

function decorateNetworksFileContent(fileContent: string) {
  return `const map = ${fileContent}; \n\nexport default map;`;
}
