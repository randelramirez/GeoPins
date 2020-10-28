import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import Context from '../../Context';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';

const CreatePin = ({ classes }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const { dispatch } = useContext(Context);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ title, image, content });
  };

  const handleDeleteDraft = () => {
    setTitle('');
    setImage('');
    setContent('');
    dispatch({ type: 'DELETE_DRAFT' });
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} />
      </Typography>
      <div>
        <TextField
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          name="title"
          label="title"
          placeholder="Insert pin title"
        />
        <input
          id="image"
          accept="image/*"
          type="file"
          onChange={(event) => setImage(event.target.files[0])}
          className={classes.input}
        />
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            style={{ color: image && 'green' }}
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      <div>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant="contained"
          color="primary"
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          disabled={!title.trim() || !content.trim() || !image}
          onClick={handleSubmit}
          color="secondary"
        >
          <SaveIcon className={classes.rightIcon} />
          Submit
        </Button>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
  },
  input: {
    display: 'none',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);
