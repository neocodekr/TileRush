# TileRush WebGL

The production WebGL build is in [`docs/`](docs/). It is a static site that can be served from the repository's GitHub Pages `main` / `docs` source.

To run it locally:

```powershell
python -m http.server 8770 --directory docs
```

Open `http://localhost:8770/` in a browser. The game uses the live Firebase and Photon services for matchmaking.

The Unity source project and local credentials are not included in this WebGL distribution commit.
