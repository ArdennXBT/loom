import { useState } from 'react';
import './Faq.css';

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    {
      question: 'Is LoomScan free?',
      answer: 'Yes, scanning tokens and tracking wallets is free to use.',
    },
    {
      question: 'Which chain does this support?',
      answer: 'LoomScan is built specifically for Robinhood Chain.',
    },
    {
      question: 'How fast are Telegram alerts?',
      answer: 'Alerts are sent in real time, as soon as a tracked wallet trades onchain.',
    },
    {
      question: 'Do I need to connect a wallet?',
      answer: 'No wallet connection is required to scan a token or browse a wallet.',
    },
  ];

  return (
    <div className="faq-section">
      <h2 className="section-title">Frequently asked questions</h2>
      <div className="faq-list">
        {items.map((item, index) => (
          <div className="faq-item" key={item.question}>
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {item.question}
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className="faq-answer">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;