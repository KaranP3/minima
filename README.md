# minima
A rough sketch of a library similar to Express with minimal dependencies that supports existing Express middleware. 
Built for learning purposes, primarily to explore Express and its internals.

```javascript
const app = new Minima();

app.get('/hello/:id', (req, res) => res.end(`Hello ${req.params.id}`));
  
app.listen(3000);
```

## Installation

```bash
$ npm install
```

## Test

```bash
# unit tests
$ npm run test
