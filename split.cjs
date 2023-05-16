const fs = require("fs");

function splitTextIntoSentences(text) {
  const sentences = [];

  // Replace instances of "lol.zip" with a unique placeholder
  const placeholder = "##LOLZIP##";
  const modifiedText = text.replace(/lol\.zip/g, placeholder);

  // Split the modified text into sentences using sentence-ending punctuation marks
  const sentenceRegex = /([^?!.]*[?!.])/g;
  let match;
  while ((match = sentenceRegex.exec(modifiedText)) !== null) {
    const sentence = match[0].trim();
    sentences.push(sentence);
  }

  // Replace the unique placeholder with "lol.zip"
  return sentences.map((sentence) => sentence.replace(placeholder, "lol.zip"));
}

// Read the input file
const inputFilePath = "data.txt";
const text = fs.readFileSync(inputFilePath, "utf-8");

// Split the text into sentences
const sentences = splitTextIntoSentences(text.replace(/\n/g, " "));

// Write the sentences to a file
const outputFilePath = "output.txt";
fs.writeFileSync(outputFilePath, sentences.join("\n"));

console.log(`Sentences written to ${outputFilePath}`);
