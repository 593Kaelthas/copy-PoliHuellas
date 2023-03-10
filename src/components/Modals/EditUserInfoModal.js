import styles from "@/styles/editUserInfoModal.module.css";

const {
  Modal,
  Box,
  Button,
  TextField,
  Grid,
  Typography,
} = require("@mui/material");

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #7E41A1",
  boxShadow: 24,
  paddingX: "2rem",
  paddingY: "1rem",
  borderRadius: "20px",
  backgroundColor: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const EditUserInfoModal = ({
  open,
  handleClose,
  register = () => "",
  errors,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" sx={style} onSubmit={onSubmit}>
        <Typography variant="h6" paddingBottom={1}>
          Editar información
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="firstName"
              label="Nombre"
              autoFocus
              color="secondary"
              {...register("name")}
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="lastName"
              color="secondary"
              {...register("lastName")}
              error={!!errors?.lastName}
              helperText={errors?.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phoneNumber"
              color="secondary"
              {...register("phoneNumber")}
              error={!!errors?.phoneNumber}
              helperText={errors?.phoneNumber?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección"
              name="location"
              color="secondary"
              {...register("location")}
              error={!!errors?.location}
              helperText={errors?.location?.message}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-around">
          <Button
            variant="outlined"
            onClick={handleClose}
            className={styles.button_exit}
          >
            Cerrar
          </Button>
          <Button type="submit" className={styles.button_save}>
            Guardar
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditUserInfoModal;
