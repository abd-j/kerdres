export interface Bidder {
  id: string;
  name: string;
}

export interface Bid {
  bidder: Bidder;
  amount: number;
  when: Date;
}

export interface ObjectToBid {
  id: string;
  name: string;
}

export interface SelledAuction {
  id: string;
  objectToBid: ObjectToBid;
  reservePrice: number;
  currency: string;
  durationInSeconds: number;
  bids: Bid[];
  bestBid: Bid | null;
  winningPrice: number;
}
