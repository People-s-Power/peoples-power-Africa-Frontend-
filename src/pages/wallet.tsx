import { GET_ALL } from 'apollo/queries/generalQuery';
import { GET_TRANSACTIONS, GET_WALLET, WiTHDRAW } from 'apollo/queries/wallet';
import axios from 'axios';
import FrontLayout from 'layout/FrontLayout';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from 'utils/constants';
import { print } from "graphql"
import { useRouter } from 'next/router';
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';
import user from './user';
import { UserAtom } from 'atoms/UserAtom';
import { useRecoilValue } from 'recoil';
import { Modal } from 'rsuite';

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from 'next/link';

const Wallet = () => {
  const { query } = useRouter()
  const [balance, setBalance] = useState(0)
  const [toggle, setToggle] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('All')
  const user = useRecoilValue(UserAtom)
  const [amount, setAmount] = useState<any>()
  const [open, setOpen] = useState(false)
  const [withdraw, setWithdraw] = useState(false)
  const [loading, setLoading] = useState(false)

  const getWallet = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(GET_WALLET),
        variables: { id: query.page },
      })
      setBalance(data.data.wallet.balance)
    } catch (e) {
      console.log(e)
    }
  }

  const getTransactions = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(GET_TRANSACTIONS),
        variables: { userId: query.page, page: 1, limit: 50 },
      })
      setTransactions(data.data.walletTx.tx)
      console.log(data.data.walletTx.tx)
    } catch (e) {
      console.log(e)
    }
  }

  const paystack_config: PaystackProps = {
    reference: new Date().getTime().toString(),
    email: user?.email,
    amount: amount * 100,
    publicKey: "pk_live_13530a9fee6c7840c5f511e09879cbb22329dc28",
    metadata: {
      purpose: "Fund wallet",
      key: query.page,
      name: user?.name,
      custom_fields: []
    },
  }

  const initializePayment = usePaystackPayment(paystack_config)
  // const router = useRouter()
  const onSuccess = async () => {
    console.log(paystack_config)
    // router.push(`/mycamp`)
  }
  const onClose = () => {
    console.log("")
  }

  const withdrawFunds = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(WiTHDRAW),
        variables: { userId: query.page, amount: parseFloat(amount) },
      })
      // console.log()
      if (data.errors) {
        toast.warn(data.errors[0].message)
      }
      setWithdraw(false)
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    getTransactions()
    getWallet()
  }, [])

  return (
    <FrontLayout showFooter={false}>
      <div className='lg:px-32 my-10'>
        <h4>Wallet</h4>
        <div className='lg:flex mt-6 justify-between'>
          <div className='lg:w-[60%]'>
            <div className='bg-[#15121280] p-6 rounded-md'>
              <div className='flex border-b pb-6'>
                <img className='w-12 h-12 my-auto' src="./images/wallet.png" alt="" />
                <div className='ml-4'>
                  <p className='text-white'>Wallet balance</p>
                  <div className='flex'>
                    <p className='font-bold text-xl text-white'>N {toggle ? '*** ***' : balance}</p>
                    <img className='ml-2 cursor-pointer' onClick={() => setToggle(!toggle)} src="./images/bx_hide.png" alt="" />
                  </div>
                </div>
              </div>
              <div className='flex'>
                <div className='p-4 text-center border-r'>
                  <button onClick={() => setOpen(true)} className='py-2 px-6 my-6 rounded-md bg-white'>Fund Your wallet</button>
                  <p className='text-white text-sm'>Fund your wallet, this works like a regular account
                    transfer from any source.</p>
                </div>
                <div className='p-4 text-center'>
                  <button onClick={() => setWithdraw(true)} className='py-2 px-6 my-6  rounded-md bg-white'>Withdraw funds</button>
                  <p className='text-white text-sm'>Request for fund Withdrawal directly to your bank account and recieve funds in minutes</p>
                </div>
              </div>
            </div>
            <Link href={"/mycamp/profile"}>
              <button className="py-3 rounded-md px-6 border my-4">Add Bank Account</button>
            </Link>
          </div>
          <div className='lg:w-[35%] h-[500px] overflow-y-auto'>
            <h5>My Transactions</h5>
            <div className='flex text-sm p-3 my-4 bg-[#D9D9D929]'>
              <p onClick={() => setFilter('All')} className='mx-4 cursor-pointer my-auto'>All</p>
              <p onClick={() => setFilter('Credits')} className='mx-4 cursor-pointer my-auto'>Credits</p>
              <p onClick={() => setFilter('Debits')} className='mx-4 cursor-pointer my-auto'>Debits</p>
            </div>
            <div>
              {transactions.length >= 1 ? transactions.map((transaction, index) =>
                filter === 'All' ?
                  <div key={index} className='flex justify-between border-b p-3'>
                    <div>
                      <p>{transaction.paymentMethod}</p>
                      <p className='text-sm'>{transaction.status}</p>
                    </div>
                    <p className={`${transaction.isInflow ? 'text-[#8FBE30]' : 'text-[#D80808CC]'} text-sm my-auto`}>{transaction.currency} {transaction.amount}</p>
                  </div>
                  : filter === "Credits" && transaction.isInflow === true ?
                    <div key={index} className='flex justify-between border-b p-3'>
                      <div>
                        <p>{transaction.paymentMethod}</p>
                        <p className='text-sm'>{transaction.status}</p>
                      </div>
                      <p className={`${transaction.isInflow ? 'text-[#8FBE30]' : 'text-[#D80808CC]'} text-sm my-auto`}>{transaction.currency} {transaction.amount}</p>
                    </div>
                    : filter === "Debits" && transaction.isInflow === false ?
                      <div key={index} className='flex justify-between border-b p-3'>
                        <div>
                          <p>{transaction.paymentMethod}</p>
                          <p className='text-sm'>{transaction.status}</p>
                        </div>
                        <p className={`${transaction.isInflow ? 'text-[#8FBE30]' : 'text-[#D80808CC]'} text-sm my-auto`}>{transaction.currency} {transaction.amount}</p>
                      </div>
                      : null
              ) : <p className='text-center'>No Transactions</p>}
            </div>
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Modal.Header>
            <div className="border-b border-gray-200 p-3 w-full">
              <Modal.Title>Fund Wallet</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className='text-center'>
              <div className='my-4'>
                <input onChange={e => setAmount(e.target.value)} value={amount} type="number" placeholder='Enter Amount to Fund' className='p-3 rounded-md border' />
              </div>
              <button disabled={amount <= 0 || undefined} className='bg-warning text-white py-2 px-6 rounded-md' onClick={() => initializePayment(onSuccess, onClose)} >Proceed</button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal open={withdraw} onClose={() => setWithdraw(false)}>
          <Modal.Header>
            <div className="border-b border-gray-200 p-3 w-full">
              <Modal.Title>Withdraw Funds</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className='text-center'>
              <div className='my-4'>
                <input onChange={e => setAmount(e.target.value)} value={amount} type="number" placeholder='Enter Amount to Withdraw' className='p-3 rounded-md border' />
              </div>
              <button className='bg-warning text-white py-2 px-6 rounded-md' onClick={() => withdrawFunds()} >{loading ? 'loading...' : 'Withdraw'}</button>
            </div>
          </Modal.Body>
        </Modal>
        <ToastContainer />
      </div>
    </FrontLayout>
  );
};

export default Wallet;
