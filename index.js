const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment");
const dirTree = require("directory-tree");

const results = [];

const tree = dirTree("./data/");
const file = tree.children.find((file) => file.name.slice(0, 6) === "blocks");
if (!file) {
  throw new Error("Please parse blockchain data first. See readme.");
}

const filepath = file.path;

function identifyTwoHourBlocks(blocks) {
  const twoHourBlocks = [];
  let index = 1;
  let longestInterval = 0;
  let longestIntervalIndex = 0;
  const TWO_HOURS_IN_SECONDS = 60 * 60 * 2;

  while (index < blocks.length) {
    const interval =
      Number(blocks[index].time) - Number(blocks[index - 1].time);
    if (interval >= TWO_HOURS_IN_SECONDS) {
      twoHourBlocks.push({ interval, number: index + 1, ...blocks[index] });
    }

    if (interval > longestInterval) {
      longestInterval = interval;
      longestIntervalIndex = index;
    }

    index++;
  }

  console.log(
    `The longest interval between blocks was ${longestInterval} seconds // ${moment
      .duration(longestInterval, "seconds")
      .humanize()}`
  );

  return twoHourBlocks;
}

fs.createReadStream(filepath)
  .pipe(
    csv({
      separator: ";",
      headers: [
        "hash",
        "height",
        "version",
        "blocksize",
        "hashPrev",
        "hashMerkleRoot",
        "time",
        "bits",
        "nonce",
      ],
    })
  )
  .on("data", (data) => results.push(data))
  .on("end", () => {
    console.log(`Evaluating ${results.length} blocks`);
    const twoHourBlocks = identifyTwoHourBlocks(results);

    console.log(
      `There have been ${twoHourBlocks.length} times 2 hours have elapsed between blocks.`
    );
    console.log("Here they are in order:");
    console.log(
      twoHourBlocks.map(
        (block) =>
          `${new Date(block.time * 1000).toDateString()}: ${moment
            .duration(block.interval, "seconds")
            .humanize()} for block ${block.number} || ${block.hash}`
      ) // unix time is "seconds since 1970" but javascript's Date.now() is "milliseconds since 1970", hence * 1000
    );
  });
