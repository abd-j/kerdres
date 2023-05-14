import { describe, expect, test } from "@jest/globals";
import { SelledAuction } from "./models";
import { Bid, Bidder, ObjectToBid } from "./types";

jest.mock("crypto", () => {
  return {
    __esModule: true,
    default: jest.fn(),
    randomUUID: jest.fn(() => "1234567890"),
  };
});

type BidderWithBids = Bidder & {
  bids: number[];
};
describe("Selled Auction", () => {
  const bidders: BidderWithBids[] = [
    {
      id: "bidder1",
      name: "A",
      bids: [110, 130],
    },
    {
      id: "bidder2",
      name: "B",
      bids: [],
    },
    {
      id: "bidder3",
      name: "C",
      bids: [125],
    },
    {
      id: "bidder4",
      name: "D",
      bids: [105, 115, 90],
    },
    {
      id: "bidder5",
      name: "E",
      bids: [132, 135, 140],
    },
  ];
  let NewAuction: SelledAuction;

  beforeAll(() => {
    const objectToBid: ObjectToBid = {
      id: "object1",
      name: "My Object",
    };
    NewAuction = new SelledAuction(objectToBid, 600, 100, "EUR");
  });

  test("Create Selled Auction", () => {
    expect(NewAuction.id).toEqual("1234567890");
    expect(NewAuction.startTime).toBeDefined();
  });

  test("Add a first bid below reserve price", () => {
    const { bids, ...bidderD } = bidders[3];
    NewAuction.addBid(bidderD, 90);
    expect(NewAuction.getLastBids().length).toEqual(1);
    expect(NewAuction.getWinningBid().bestprice).toEqual(null);
    expect(NewAuction.getWinningBid().bid).toEqual(null);
  });

  test("Add a second bid equal reserve price", () => {
    const { bids, ...bidderA } = bidders[0];
    NewAuction.addBid(bidderA, 100);
    expect(NewAuction.getLastBids().length).toEqual(2);
    expect(NewAuction.getWinningBid().bestprice).toEqual(100);
    expect(NewAuction.getWinningBid().bid?.bidder.name).toEqual("A");
  });
});

describe("Get winning bid/bidder from a list of bids", () => {
  const bidders: BidderWithBids[] = [
    {
      id: "bidder1",
      name: "A",
      bids: [110, 130],
    },
    {
      id: "bidder2",
      name: "B",
      bids: [],
    },
    {
      id: "bidder3",
      name: "C",
      bids: [125],
    },
    {
      id: "bidder4",
      name: "D",
      bids: [105, 115, 90],
    },
    {
      id: "bidder5",
      name: "E",
      bids: [132, 135, 140],
    },
  ];
  let NewAuction: SelledAuction;

  beforeAll(() => {
    const objectToBid: ObjectToBid = {
      id: "object1",
      name: "My Object",
    };
    NewAuction = new SelledAuction(objectToBid, 600, 100, "EUR");
    bidders.map((bidsByBidder) => {
      const { bids, ...bidder } = bidsByBidder;
      bids.map((bid) => {
        console.log(`${bidder.name} bid ${bid}`);
        NewAuction.addBid(bidder, bid);
      });
    });
  });

  test("Scenario", () => {
    expect(NewAuction.getLastBids().length).toEqual(9);
    expect(NewAuction.getWinningBid().bestprice).toEqual(130);
    expect(NewAuction.getWinningBid().bid?.bidder.name).toEqual("E");
  });
});
