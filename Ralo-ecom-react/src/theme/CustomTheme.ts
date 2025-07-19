import { createTheme } from '@mui/material/styles';

const CustomTheme = createTheme({
    palette: {
        primary: {
            main: '#5ec0f8',
        },
        secondary: {
            main: '#6bc9ff',
        },
        mode: 'light', // or 'dark'
    }
});

export default CustomTheme;