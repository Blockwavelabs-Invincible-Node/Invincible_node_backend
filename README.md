# Invincible_node_backend

# Requirements
- evmosd
- heimdalld
- kavad
- node version v16 or up

# Backend
Run following commands for each chain ( Kava, Evmos, Polygon )

1. node ClaimReward.js
- Claim and update reward every hour
2. node ListenStakeEvent.js
- listen to stake event using event subscriber
3. node ListenUnbondEvent.js
- listen to unbond request using event subscriber
