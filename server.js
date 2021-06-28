const PORT = 3000;

const app = require("./app");

app.listen(PORT, () => {
    console.info(`server running at http://localhost:${PORT}`);
});