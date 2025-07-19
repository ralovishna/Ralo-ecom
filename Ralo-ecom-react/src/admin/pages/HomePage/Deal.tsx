import { Button } from '@mui/material';
import React from 'react'
import DealTable from './DealTable.tsx'
import DealCategoryTable from './DealCategoryTable.tsx'
import CreateDealForm from './CreateDealForm.tsx'


const tabs = [
  "Deals",
  "Category",
  "Create Deal"
];

const Deal = () => {
  const [activeTab, setActiveTab] = React.useState("Deals");

  return (
    <div >
      <div className="flex gap-4">
        {tabs.map((tab) =>
          <Button
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "contained" : "outlined"}> {tab} </Button>
        )}
      </div>
      <div className="mt-5">
        {
          activeTab === "Deals" ?
            (<DealTable />) :
            activeTab === "Category" ?
              (<DealCategoryTable />) :
              (
                <div className="mt-5 flex flex-col justify-center items-centerh-[70vh]">
                  <CreateDealForm />
                </div>
              )
        }
      </div>
    </div>
  )
}

export default Deal
