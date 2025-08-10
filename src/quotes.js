const NATURE_QUOTES = [
  // English Nature Quotes
  "Nature does not hurry, yet everything is accomplished. – Lao Tzu",
  "The earth has music for those who listen. – Shakespeare",
  "In every walk with nature, one receives far more than they seek. – John Muir",
  "Look deep into nature, and you will understand everything better. – Einstein",
  "Nature always wears the colors of the spirit. – Ralph Waldo Emerson",
  "The mountains are calling and I must go. – John Muir",
  "Adopt the pace of nature: her secret is patience. – Ralph Waldo Emerson",
  "Nature is not a place to visit. It is home. – Terry Tempest Williams",
  
  // Khmer Nature Quotes
  "«ធម្មជាតិជាគ្រូល្អបំផុតសម្រាប់ចិត្ត» – អនាមិក",
  "«រុក្ខជាតិមួយគ្រាប់បង្ហាញពីភាពស្រស់ស្អាតនៃជីវិត» – អនាមិក",
  "«ធម្មជាតិមិនចាំបាច់និយាយ យើងស្តាប់ដោយចិត្ត» – អនាមិក",
  "«ស្ងាត់ស្ងៀមក្នុងព្រៃ គឺស្ងប់ស្ងៀមក្នុងចិត្ត» – អនាមិក",
  "«ធម្មជាតិជាថ្នាំព្យាបាលស្រស់ស្អាតបំផុត» – អនាមិក",
  "«សួនផ្កាតូចធ្វើឲ្យចិត្តធំធាត់សប្បាយ» – អនាមិក",
  "«ពេលភ្លៀងធ្លាក់ ជីវិតលាបជាពណ៌ស្រស់ស្អាត» – អនាមិក",
  "«មេឃស្រអាប់មិនមានន័យថាអនាគតងងឹត» – អនាមិក",
  "«ធម្មជាតិធ្វើឲ្យចិត្តស្រស់ស្អាត» – អនាមិក",
  "«ចិត្តត្រជាក់នៅពេលនៅជាមួយធម្មជាតិ» – អនាមិក",
  
  // Garden-specific quotes
  "To plant a garden is to believe in tomorrow. – Audrey Hepburn",
  "Gardens require patient labor and attention. But the reward is peace. – Liberty Hyde Bailey",
  "«សួនគឺជាទីកន្លែងនៃសុខសាន្ត» – អនាមិក",
  "«ដាំដើមគឺជាការបង្កើតអនាគត» – អនាមិក",
];

function getRandomQuote() {
  return NATURE_QUOTES[Math.floor(Math.random() * NATURE_QUOTES.length)];
}

module.exports = {
  getRandomQuote
};