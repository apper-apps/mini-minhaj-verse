const mockTransactions = [
  {
    Id: 1,
    userId: 1,
    type: 'credit',
    amount: 50.00,
    description: 'Weekly teaching bonus',
    timestamp: '2024-01-20T09:00:00Z',
    balanceAfter: 250.75
  },
  {
    Id: 2,
    userId: 2,
    type: 'credit',
    amount: 25.00,
    description: 'Quran memorization milestone reward',
    timestamp: '2024-01-19T14:30:00Z',
    balanceAfter: 125.50
  },
  {
    Id: 3,
    userId: 1,
    type: 'debit',
    amount: 15.00,
    description: 'Islamic books purchase',
    timestamp: '2024-01-18T16:45:00Z',
    balanceAfter: 200.75
  },
  {
    Id: 4,
    userId: 4,
    type: 'credit',
    amount: 75.00,
    description: 'Arabic calligraphy workshop earnings',
    timestamp: '2024-01-18T11:20:00Z',
    balanceAfter: 320.25
  },
  {
    Id: 5,
    userId: 5,
    type: 'credit',
    amount: 20.00,
    description: 'Daily learning completion bonus',
    timestamp: '2024-01-17T19:10:00Z',
    balanceAfter: 85.00
  },
  {
    Id: 6,
    userId: 2,
    type: 'debit',
    amount: 10.00,
    description: 'Prayer times app subscription',
    timestamp: '2024-01-16T12:00:00Z',
    balanceAfter: 100.50
  },
  {
    Id: 7,
    userId: 1,
    type: 'credit',
    amount: 100.00,
    description: 'Monthly teaching salary',
    timestamp: '2024-01-15T10:00:00Z',
    balanceAfter: 215.75
  }
];

export default mockTransactions;