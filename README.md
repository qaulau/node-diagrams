node-diagrams
==============

Using the Node.js generate Flowcharts, Network Sequence, and Mermaid Diagrams



Installation
--------------

```bash
npm install -g node-diagrams
```


Usage
------


## Generate Flowcharts:

```javascript
data = diagrams.drawnFlowchart(`
st=>start: Start
e=>end
op=>operation: My Operation
cond=>condition: Yes or No?
st->op->cond
cond(yes)->e
cond(no)->op
`);

```



## Generate Network Sequence:

```javascript
data = diagrams.drawnSequence(`
Title: Here is a title
A->B: Normal line
B-->C: Dashed line
C->>D: Open arrow
D-->>A: Dashed open arrow
`);


```


## Generate Mathjax

```javascript
data = diagrams.drawnMathjax(`
E(\\mathbf{v}, \\mathbf{h}) = -\\sum_{i,j}w_{ij}v_i h_j - \\sum_i b_i v_i - \\sum_j c_j h_j
\[3 < 4\]

\begin{align}
    p(v_i=1|\mathbf{h}) & = \sigma\left(\sum_j w_{ij}h_j + b_i\right) \\
    p(h_j=1|\mathbf{v}) & = \sigma\left(\sum_i w_{ij}v_i + c_j\right)
\end{align}

$p(x|y) = \frac{p(y|x)p(x)}{p(y)}$, \(p(x|y) = \frac{p(y|x)p(x)}{p(y)}\).

`);
```


## Generat Mernaid diagrams

```javascript
data = diagrams.drawnMermaid(`
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
`);

```



Credits
--------

  - [flowchart.js](http://flowchart.js.org/) for the flowchart diagrams
  - [js-sequence-diagrams](https://bramp.github.io/js-sequence-diagrams/) for the sequence diagrams
  - [MathJax](https://github.com/mathjax/MathJax) for he mathjax diagrams
  - [mermaid](https://github.com/knsv/mermaid) for the mermaid diagrams
  - [electron](http://electron.atom.io/) for headless browsing to wrap above libraries that don't work without a browser environment



License
-------

This document and all associated files in the github project are licensed under [CC0](http://creativecommons.org/publicdomain/zero/1.0/) ![](http://i.creativecommons.org/p/zero/1.0/80x15.png).
This means you can reuse, remix, or otherwise appropriate this project for your own use **without restriction**.