import { randomUUID } from "crypto";
import {
  Bidder,
  Bid,
  ObjectToBid,
  SelledAuction as SelledAuctionType,
} from "./types";

type SelledAuctionConfig = Omit<SelledAuctionType, "id" | "bids" | "bestBid">;

export class SelledAuction {
  readonly id;
  readonly startTime: Date | null = null;
  protected bids: Bid[] = [];
  protected bestBid: Bid | null = null;
  protected winningPrice: number | null = null;

  constructor(
    readonly objectToBid: ObjectToBid,
    readonly durationInSeconds: number,
    readonly reservePrice: number,
    readonly currency: string = "EUR"
  ) {
    this.id = randomUUID();
    this.startTime = new Date();
  }

  public addBid(bidder: Bidder, amount: number) {
    const newBid = {
      bidder,
      amount,
      when: new Date(),
    };

    this.isValidBid(newBid);

    this.bids.push(newBid);

    if (newBid.amount > this.reservePrice) {
      if (!this.bestBid) {
        this.bestBid = newBid;
        this.winningPrice = newBid.amount;
      } else this.checkBestBid(newBid);
    }
  }

  private isValidBid(bid: Bid) {
    if (bid.amount <= 0) {
      throw new Error(
        `Bid not valid: amount should be upper 0 ${this.currency}`
      );
    }
    if (
      bid.when.getTime() >
      this.startTime!.getTime() + this.durationInSeconds
    ) {
      throw new Error("Bid not valid: Auction is finished");
    }
  }

  private checkBestBid(bid: Bid) {
    if (!this.bestBid) throw new Error("Should have at least one bid");

    if (bid.amount > this.bestBid.amount) {
      this.winningPrice =
        this.bestBid.bidder.id !== bid.bidder.id
          ? this.bestBid.amount
          : this.winningPrice;
      this.bestBid = bid;
    }
  }

  public getLastBids() {
    return this.bids;
  }

  public getWinningBid() {
    return {
      bid: this.bestBid,
      bestprice: this.winningPrice,
    };
  }
}
