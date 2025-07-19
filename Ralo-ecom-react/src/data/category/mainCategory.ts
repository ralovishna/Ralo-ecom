const mainCategory = [
    {
        name: 'Men',
        categoryId: 'men',
        level: 1,
        levelCategoryTwo: [
            {
                "name": 'Top wear',
                "categoryId": "men_topwear",
                "parentCategoryId": "men",
                "level": 2,
            },
            {
                "name": 'Bottom wear',
                "categoryId": "men_bottomwear",
                "parentCategoryId": "men",
                "level": 2,
            },
            {
                "name": 'Footwear',
                "categoryId": "men_footwear",
                "parentCategoryId": "men",
                "level": 2,
            },
            {
                "name": 'Innerwear and Sleepwear',
                "categoryId": "men_innerwear_and_sleepwear",
                "parentCategoryId": "men",
                "level": 2,
            },
            {
                "name": 'Personal and Grooming',
                "categoryId": "men_personal_and_grooming",
                "parentCategoryId": "men",
                "level": 2,
            },
            {
                "name": 'Fashion Accessories',
                "categoryId": "men_fashion_accessories",
                "parentCategoryId": "men",
                "level": 2,
            }
        ]
    },
    {
        name: 'Women',
        categoryId: 'women',
        level: 1,
    },
    {
        name: 'Home & Furniture',
        categoryId: 'home_furniture',
        level: 1,
    },
    {
        name: 'Electronics',
        categoryId: 'electronics',
        level: 1,
    }
]

export default mainCategory
