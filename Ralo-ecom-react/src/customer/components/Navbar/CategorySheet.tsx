import React from 'react'
import menLevelThree from '../../../data/category/level three/menLevelThree.ts'
import womenLevelThree from '../../../data/category/level three/womenLevelThree.ts'
import electronicsLevelThree from '../../../data/category/level three/electronicsLevelThree.ts'
import homeLevelThree from '../../../data/category/level three/homeLevelThree.ts'
import menLevelTwo from '../../../data/category/level two/menLevelTwo.ts'
import womenLevelTwo from '../../../data/category/level two/womenLevelTwo.ts'
import electronicsLevelTwo from '../../../data/category/level two/electronicsLevelTwo.ts'
import homeLevelTwo from '../../../data/category/level two/homeLevelTwo.ts'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const categoryThree: { [key: string]: any[] } = {
    men: menLevelThree,
    women: womenLevelThree,
    electronics: electronicsLevelThree,
    home_furniture: homeLevelThree,
}

const categoryTwo: { [key: string]: any[] } = {
    men: menLevelTwo,
    women: womenLevelTwo,
    electronics: electronicsLevelTwo,
    home_furniture: homeLevelTwo,
}

const CategorySheet = ({ selectedCategory, setShowSheet }: any) => {
    const navigate = useNavigate();

    const childCategory = (category: any, parentCategoryId: any) => {
        return category.filter((item: any) => item.parentCategoryId === parentCategoryId)
    }
    return (
        <Box sx={
            { zIndex: 2 }
        } className='bg-white shadow-lg lg:h-[500px] overflow-y-auto'>
            <div className='flex flex-wrap text-sm'>
                {
                    categoryTwo[selectedCategory]?.map((item: any, index) =>
                        <div className={`p-8 lg:w-[20%] ${index % 2 === 0 ? 'bg-fuchsia-50' : 'bg-white'}`} key={item.categoryId}>
                            <p className='text-primary-color mb-5 font-semibold'>
                                {item.name}
                            </p>
                            <ul className='space-y-3'>
                                {
                                    childCategory(categoryThree[selectedCategory], item.categoryId).map((childItem: any) =>
                                        <div>

                                            <li
                                                onMouseDown={() => navigate(`/products/${childItem.categoryId}/`)}
                                                className='hover:text-primary-color cursor-pointer '>{childItem.name}</li>
                                        </div>)
                                }

                            </ul>
                        </div>
                    )
                }
            </div>
        </Box>
    )
}

export default CategorySheet
