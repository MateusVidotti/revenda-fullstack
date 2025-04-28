import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate  } from 'react-router-dom'

const AddButton = ({label, url}) => {
    const handleNavigate = useNavigate()
    const handleClick = () => {
        handleNavigate(url)
    };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={handleClick}
      sx={{ margin: '20px 0', backgroundColor: '#7A9E7E', '&:hover': { backgroundColor: '#D8A39D' } }}
    >
      Criar {label}
    </Button>
  );
};

export default AddButton