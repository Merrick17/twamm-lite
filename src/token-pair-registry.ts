/* eslint-disable prettier/prettier */
type Registry = {
  [key: string]: string[];
};

export const tokenPairRegistry: Registry = {
  // ETH
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // wBTC
  "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // USDCet
  "A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // MNGO
  "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // HNT
  "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // SAMO
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // SOL
  "So11111111111111111111111111111111111111112": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // ORCA
  "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // RAY
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // MNDE
  "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // LFNTY
  "LFNTYraetVioAPnGJht4yNg2aUZFXR776cMeN9VMjXp": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // ARB
  "9tzZzEHsKnwFL1A3DyFJwj36KnZj3gZ7g4srWp9YTEoh": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // HBB
  "HBB111SCo9jkCejsZfz8Ec8nH7T6THF8KEKSnvwT6XK6": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // TULIP
  "TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ],
  // LDO
  "HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  ],
  // HADES
  "BWXrrYFhT7bMHmNBFoQFWdsSgA3yXoAnMhDK6Fn1eSEn": [
    "9TVjnzpF3X8DHsfVqYWoCGphJxtGYh1PDCFN5QmsHW5t"
  ],
  // MDS
  "9TVjnzpF3X8DHsfVqYWoCGphJxtGYh1PDCFN5QmsHW5t": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  ],
  // ATLAS
  "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  ],
  // DUST
  "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  ],
  // BONK
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ], 
  // UXP
  "UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  ],
};

export const definedPairs: AddressPair[] = [];
for (let i = 0; i < Object.keys(tokenPairRegistry).length; i += 1) {
  const tokenA = Object.keys(tokenPairRegistry)[i];
  const tokenPair = tokenPairRegistry[tokenA];
  for (let j = 0; j < tokenPair.length; j += 1) {
    definedPairs.push([tokenA, tokenPair[j]]);
  }
}
