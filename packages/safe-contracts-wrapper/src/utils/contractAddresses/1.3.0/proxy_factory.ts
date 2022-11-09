const map = [
  ["1", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["3", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["4", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["5", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["10", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["11", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["12", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["25", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["28", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["42", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["56", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["69", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["82", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["83", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["100", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["106", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["111", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["122", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["123", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["137", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["246", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["288", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["300", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["336", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["338", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["588", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["592", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["595", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["686", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["787", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["1001", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["1008", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["1088", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["1284", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["1285", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["1287", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["1984", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["2001", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["2008", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["4002", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["4918", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["4919", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["7341", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["8217", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["9000", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["9001", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["10000", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["10001", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["11437", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["12357", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["42161", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["42170", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["42220", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["43114", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["47805", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["71401", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["73799", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["80001", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["200101", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["200202", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["333999", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["421611", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["421613", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["1313161554", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["1313161555", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["1666600000", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["1666700000", "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC"],
  ["11297108099", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
  ["11297108109", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
];

export default map;