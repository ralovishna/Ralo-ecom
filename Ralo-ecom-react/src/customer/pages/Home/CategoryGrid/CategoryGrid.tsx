import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const CategoryGrid = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const categories = [
        {
            id: 1,
            title: "Women's Fashion",
            img: "https://i.pinimg.com/originals/6b/ca/fc/6bcafc3efaade0f29a1fe1cef9a661c3.jpg",
            colSpan: { xs: 12, md: 3 },
            rowSpan: 2,
            position: 'left'
        },
        {
            id: 2,
            title: "Watches",
            img: "https://th.bing.com/th/id/OIP.3gtkoRQrift5EzHUZ-NPWwAAAA",
            colSpan: { xs: 6, md: 2 },
            rowSpan: 1,
            position: 'top-middle'
        },
        {
            id: 3,
            title: "Bridal Accessories",
            img: "https://media.istockphoto.com/photos/bridal-flower-and-bridal-shoes-picture-id1416696677?b=1&k=20&m=1416696677&s=170667a&w=0&h=-d02sfBAktGU4EBtFwtrwiNamaxT_2CryLcxZ0tEilU=",
            colSpan: { xs: 6, md: 4 },
            rowSpan: 1,
            position: 'top-middle'
        },
        {
            id: 4,
            title: "Jewelry",
            img: "https://vaanijewellery.com/wp-content/uploads/elementor/thumbs/87636-p3loqtaof0v1w2erwbmcimq4qcjykn0ffs118aegd4.jpg",
            colSpan: { xs: 6, md: 4 },
            rowSpan: 1,
            position: 'bottom-middle'
        },
        {
            id: 5,
            title: "Wedding Rings",
            img: "https://th.bing.com/th/id/OIP.jxkfQgh7DXfEPILDlib-LQHaE7",
            colSpan: { xs: 6, md: 2 },
            rowSpan: 1,
            position: 'bottom-middle'
        },
        {
            id: 6,
            title: "Men's Fashion",
            img: "https://i0.wp.com/www.theunstitchd.com/wp-content/uploads/2017/12/best-sherwani-for-men.jpg",
            colSpan: { xs: 12, md: 3 },
            position: 'top',
            rowSpan: 2,
            customStyles: {
                md: {
                    gridColumnStart: 10,
                    gridColumnEnd: 13,
                    gridRowStart: 1,
                    gridRowEnd: 3
                }
            }
        }

    ];

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(12, 1fr)' },
            gap: { xs: 2, md: 4 },
            px: { xs: 2, md: 5 },
            my: 4,
            minHeight: { md: 500 }
        }}>
            {categories.map((category) => {
                const gridStyles = category.customStyles?.md
                    ? {
                        gridColumnStart: [null, category.customStyles.md.gridColumnStart],
                        gridColumnEnd: [null, category.customStyles.md.gridColumnEnd],
                        gridRowStart: [null, category.customStyles.md.gridRowStart],
                        gridRowEnd: [null, category.customStyles.md.gridRowEnd],
                    }
                    : {
                        gridColumn: {
                            xs: `span ${category.colSpan.xs}`,
                            md: `span ${category.colSpan.md}`
                        },
                        gridRow: {
                            md: `span ${category.rowSpan}`
                        }
                    };

                return (
                    <Box
                        key={category.id}
                        sx={{
                            ...gridStyles,
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            height: { xs: 200, md: category.rowSpan === 2 ? 500 : 240 },
                            cursor: 'pointer',
                            '&:hover .category-overlay': {
                                opacity: 1
                            }
                        }}
                    >
                        <Box
                            component="img"
                            src={category.img}
                            alt={category.title}
                            loading="lazy"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.03)'
                                }
                            }}
                        />
                        <Box
                            className="category-overlay"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                color: 'white',
                                p: 2,
                                opacity: { xs: 1, md: 0 },
                                transition: 'opacity 0.3s ease'
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                {category.title}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                Shop Now
                            </Typography>
                        </Box>
                    </Box>
                );
            })}

        </Box>
    );
};

export default CategoryGrid;