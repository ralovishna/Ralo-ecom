// src/customer/pages/Account/FilterSection.tsx

import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { cyan } from '@mui/material/colors'
import React from 'react' // No need for 'use' import
import { colors } from '../../../data/filter/colors.ts'
import { prices } from '../../../data/filter/prices.ts'
import { discounts } from '../../../data/filter/discounts.ts'
import { useSearchParams } from 'react-router-dom';


const FilterSection = () => {
    const [expandColor, setExpandColor] = React.useState(false);
    const [searchParameters, setSearchParameters] = useSearchParams();

    const updateFilterParameters = (event: React.ChangeEvent<HTMLInputElement>) => { // Explicitly type event
        const { name, value } = event.target;

        const currentSearchParams = new URLSearchParams(searchParameters); // Create a mutable copy

        if (value) {
            currentSearchParams.set(name, value);
        } else {
            currentSearchParams.delete(name);
        }
        setSearchParameters(currentSearchParams); // Update the URL
    }

    const clearAllFilterParameters = () => {
        setSearchParameters(new URLSearchParams()); // Set an empty URLSearchParams object to clear all
    }

    const handleExpandColor = () => {
        setExpandColor(!expandColor);
    }

    return (
        <div className='bg-white -z-50 space-y-5'>
            <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
                <p className="text-lg font-semibold">
                    Filters
                </p>
                <Button
                    onClick={clearAllFilterParameters}
                    size='small' className='text-primary-color cursor-pointer font-semibold'>
                    Clear All
                </Button>
            </div>
            <Divider />
            <div className="px-9 space-y-6">
                <section>
                    <FormControl>
                        <FormLabel
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: cyan[400],
                                pb: "14px"
                            }}

                            className='text-2xl font-semibold'
                            id='color'>Color</FormLabel>
                        <RadioGroup
                            onChange={updateFilterParameters}
                            aria-labelledby="color"
                            value={searchParameters.get('color') || ''} // Set value from URL
                            name="color"
                        >
                            {
                                colors.slice(0, expandColor ? colors.length : 5).map((color) =>
                                    <FormControlLabel
                                        key={color.name} // Add key prop
                                        value={color.name}
                                        control={<Radio size='small' />} // Added size='small' for consistency
                                        label={
                                            <div className='flex items-center gap-2'>
                                                <p>{color.name}</p>
                                                <span
                                                    style={{ backgroundColor: color.hex }}
                                                    className={`h-5 w-5 rounded-full ${color.name.toLowerCase() === 'white' ? "border" : ""}`}></span>
                                            </div>
                                        } />
                                )
                            }
                        </RadioGroup>
                    </FormControl>
                    <div>
                        <button
                            onClick={handleExpandColor}
                            className='text-primary-color cursor-pointer hover:text-cyan-800 flex items-center'>
                            {expandColor ? 'hide' : `+${colors.length - 5} more colors`}
                        </button>
                    </div>
                </section>

                <section>
                    <FormControl>
                        <FormLabel
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: cyan[400],
                                pb: "14px"
                            }}

                            className='text-2xl font-semibold'
                            id='price'>Price</FormLabel>
                        <RadioGroup
                            onChange={updateFilterParameters}
                            aria-labelledby="price"
                            value={searchParameters.get('price') || ''} // Set value from URL
                            name="price"
                        >
                            {
                                prices.map((price) =>
                                    <FormControlLabel
                                        key={price.name} // Add key prop
                                        value={price.value}
                                        control={<Radio size='small' />}
                                        label={price.name} />
                                )
                            }
                        </RadioGroup>
                    </FormControl>
                </section>

                <section>
                    <FormControl>
                        <FormLabel
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: cyan[400],
                                pb: "14px"
                            }}

                            className='text-2xl font-semibold'
                            id='discount'>Discount</FormLabel>
                        <RadioGroup
                            onChange={updateFilterParameters}
                            aria-labelledby="discount"
                            value={searchParameters.get('discount') || ''} // Set value from URL
                            name="discount"
                        >
                            {
                                discounts.map((discount) =>
                                    <FormControlLabel
                                        key={discount.name} // Add key prop
                                        value={discount.value}
                                        control={<Radio size='small' />}
                                        label={discount.name} />
                                )
                            }
                        </RadioGroup>
                    </FormControl>
                </section>
            </div>
        </div>
    )
}

export default FilterSection