use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{AssetName, PolicyId}

pub type MarketplaceRedeemer {
  Sell
  Buy
  Refund
  Order
}

pub type MarketplaceDatum {
  policy_id: PolicyId,
  asset_name: AssetName,
  seller: VerificationKeyHash,
  price: Int,
  royalties: Int,
  order: Option<Ord>,
}

pub type Ord {
  owner: VerificationKeyHash,
  value: Int,
}
