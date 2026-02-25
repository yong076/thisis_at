# thisis.at PRD Summary

## Product

- One-link mini-site builder for `ARTIST`, `VENUE`, `CREATOR` profiles.
- Public URL model: `/@handle`.
- Ecosystem goal: bi-directional connection with `trappist.app`.

## MVP included in this scaffold

- Account model draft for `PHONE`, `GOOGLE`, `KAKAO`.
- Multi-profile management shell.
- Block-based public rendering.
- Trappist read-integration API stub.
- OG image generation endpoint.

## Ownership model

- thisis.at owns profile metadata and blocks.
- trappist owns event/place data.
- thisis.at reads events from trappist.

## V1 extension path

- thisis.at event authoring writes through trappist API.
- Webhook: `profile.published` and `profile.updated`.
- Shared identity or mapped identity upgrade path.
