import React from 'react'
import { Card, Divider, Button } from '@mui/material'
import Transaction from '../Payment/Transaction.tsx'
import { useAppSelector } from '../../../State/Store.ts'

const Payment = () => {
  const { transactions } = useAppSelector(store => store.transactions);

  const totalEarning = transactions.reduce((acc, curr) => acc + (curr.order?.totalSellingPrice || 0), 0);
  const lastPayment = transactions.length > 0
    ? transactions[transactions.length - 1]?.order?.totalSellingPrice || 0
    : 0;

  return (
    <div>
      <Card className='rounded-md space-y-4 p-4'>
        <h1 className="text-gray-600 font-medium">Total Earning</h1>
        <h1 className="font-bold text-xl pb-1">₹{totalEarning}</h1>
        <Divider />
        <p className="text-gray-600 font-medium pt-1">Last Payment : <strong>₹{lastPayment}</strong></p>
      </Card>

      <div className='pt-10 space-y-3'>
        <Button variant='contained'>
          Transaction
        </Button>
        <Transaction />
      </div>
    </div>
  )
}

export default Payment
