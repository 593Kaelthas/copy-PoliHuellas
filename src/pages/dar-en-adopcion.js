import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Container,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import styles from "../styles/newAdoption.module.css";
import { uploadPetImage, newPost } from "@/lib/giveAdoption";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { getDownloadURL } from "firebase/storage";
import Routes from "src/constants/routes";
import QUESTIONS from "src/constants/questions";
import PETTYPE from "src/constants/petType";
import withAuth from "@/hocs/withAuth";
import PetsIcon from "@mui/icons-material/Pets";
import UploadIcon from "@mui/icons-material/Upload";
import { useRouter } from "next/router";

const schema = yup.object({
  petAge: yup
    .string("El campo debe ser alfanumérico")
    .required("Este campo es requerido"),
  petSize: yup.string().required("Este campo es requerido"),
  petSex: yup.string().required("Este campo es requerido"),
  petType: yup.string().required("Este campo es requerido"),
  petName: yup.string().required("Este campo es requerido"),
  answerOne: yup.string().required("Este campo es requerido"),
  answerTwo: yup.string().required("Este campo es requerido"),
  answerThree: yup.string().required("Este campo es requerido"),
  answerFour: yup.string().required("Este campo es requerido"),
});

function Giveadoption() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { currentUser, session } = useAuth();
  const [task, setTask] = useState();
  const [imgURL, setImgURL] = useState("");
  const [file, setFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    if (task) {
      task?.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          console.log("Upload completed");
          getDownloadURL(task.snapshot.ref).then(setImgURL);
        }
      );
    }
  }, [task]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file !== undefined) {
      setFile(file);
      const task = uploadPetImage(file, currentUser.uid);
      setTask(task);
      setImageName(file.name);
    }
  };

  const handleClose = async () => {
    setOpen(false);
    push(Routes.USERPROFILE(session.uid));
  };

  const onSubmit = async (data) => {
    const {
      answerOne,
      answerTwo,
      answerThree,
      answerFour,
      petType,
      petName,
      petSize,
      petAge,
      petSex,
      extraDescription,
    } = data;
    try {
      await newPost(
        answerOne,
        answerTwo,
        answerThree,
        answerFour,
        petType,
        petName,
        petSize,
        petAge,
        petSex,
        imgURL,
        extraDescription,
        currentUser.uid
      );
      setOpen(true);
    } catch (error) {
      if (error.response) {
        alert(error.response.message);
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  return (
    <>
      <Container className={styles.banner_container}>
        <Image
          src="/images/banner-form-post.webp"
          alt="cover"
          width="1800px"
          height="580px"
        />
        <Typography className={styles.title_banner}>
          Formulario para publicar una
          <span className={styles.text_span}> mascota </span>
        </Typography>
      </Container>
      <Container className={styles.container}>
        <Stack direction="row" spacing={1}>
          <PetsIcon className={styles.icon_pet} />
          <Typography>
            Por favor, completa el presente formulario si deseas dar una mascota
            en adopción.
          </Typography>
        </Stack>
      </Container>
      <Box
        className={styles.form_container}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>{QUESTIONS.GIVE_Q1}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="question-one"
              select
              defaultValue=""
              label="Seleccionar una opción"
              {...register("answerOne")}
              error={!!errors.answerOne}
              helperText={
                errors?.answerOne?.message
                  ? errors?.answerOne?.message
                  : QUESTIONS.GIVE_Q1
              }
            >
              <MenuItem value="" disabled>
                <em>Seleccione</em>
              </MenuItem>
              <MenuItem value="Rescatado de la calle">
                Rescatado de la calle
              </MenuItem>
              <MenuItem value="Alergías">Alergías</MenuItem>
              <MenuItem value="Cambio de domicilio">
                Cambio de domicilio
              </MenuItem>
              <MenuItem value="No permiten mascotas en lugar de residencia">
                No permiten mascotas en lugar de residencia
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>{QUESTIONS.GIVE_Q2}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="question-two"
              select
              defaultValue=""
              label="Seleccionar una opción"
              {...register("answerTwo")}
              error={!!errors.answerTwo}
              helperText={
                errors?.answerTwo?.message
                  ? errors?.answerTwo?.message
                  : QUESTIONS.GIVE_Q2
              }
            >
              <MenuItem value="" disabled>
                <em>Seleccione</em>
              </MenuItem>
              <MenuItem value="Agresivo">Agresivo</MenuItem>
              <MenuItem value="Tranquilo">Tranquilo</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>{QUESTIONS.GIVE_Q3}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="question-three"
              select
              defaultValue=""
              label="Seleccionar una opción"
              {...register("answerThree")}
              error={!!errors.answerThree}
              helperText={
                errors?.answerThree?.message
                  ? errors?.answerThree?.message
                  : QUESTIONS.GIVE_Q3
              }
            >
              <MenuItem value="" disabled>
                <em>Seleccione</em>
              </MenuItem>
              <MenuItem value="Sí">Sí</MenuItem>
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="No lo sé">No lo sé</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>{QUESTIONS.GIVE_Q4}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="question-four"
              select
              defaultValue=""
              label="Seleccionar una opción"
              {...register("answerFour")}
              error={!!errors.answerFour}
              helperText={
                errors?.answerFour?.message
                  ? errors?.answerFour?.message
                  : QUESTIONS.GIVE_Q4
              }
            >
              <MenuItem value="" disabled>
                <em>Seleccione</em>
              </MenuItem>
              <MenuItem value="No, la encontré en la calle">
                No, la encontré en la calle
              </MenuItem>
              <MenuItem value="Sí, es mía">Sí, es mía</MenuItem>
              <MenuItem value="Es de un amigo o familiar">
                Es de un amigo o familiar
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>Tipo de mascota</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="petType"
              select
              defaultValue=""
              label="Seleccionar una opción"
              {...register("petType")}
              error={!!errors.petType}
              helperText={
                errors?.petType?.message
                  ? errors?.petType?.message
                  : "Seleccione el tipo de mascota"
              }
            >
              <MenuItem value="" disabled>
                <em>Seleccione</em>
              </MenuItem>
              <MenuItem value={PETTYPE.GATO}>{PETTYPE.GATO}</MenuItem>
              <MenuItem value={PETTYPE.PERRO}>{PETTYPE.PERRO}</MenuItem>
              <MenuItem value={PETTYPE.OTROS}>{PETTYPE.OTROS}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>Nombre de la mascota</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="petAge"
              label="Ingrese el nombre de la mascota"
              {...register("petName")}
              error={!!errors.petName}
              helperText={
                errors?.petName?.message
                  ? errors?.petName?.message
                  : "Ingrese el nombre que tiene o como quisieras llamarlo"
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>Tamaño de la mascota</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="petSize"
              select
              defaultValue=""
              label="Seleccione el tamaño de la mascota"
              {...register("petSize")}
              error={!!errors.petSize}
              helperText={
                errors?.petSize?.message
                  ? errors?.petSize?.message
                  : "Tamaño de la mascota"
              }
            >
              <MenuItem value="" disabled>
                <em>Seleccione</em>
              </MenuItem>
              <MenuItem value="Grande">Grande</MenuItem>
              <MenuItem value="Mediano">Mediano</MenuItem>
              <MenuItem value="Pequeño">Pequeño</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>Edad de la mascota</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="petAge"
              label="Ingrese la edad de la mascota"
              {...register("petAge")}
              error={!!errors.petAge}
              helperText={
                errors?.petAge?.message
                  ? errors?.petAge?.message
                  : "En años y meses. (Ej. 1 año y 2 meses)"
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>Sexo de la mascota</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={styles.select}
              id="petSex"
              select
              defaultValue=""
              label="Seleccionar una opción"
              {...register("petSex")}
              error={!!errors.petSex}
              helperText={
                errors?.petSex?.message
                  ? errors?.petSex?.message
                  : "Sexo de la mascota"
              }
            >
              <MenuItem value="" disabled>
                <em>Seleccione</em>
              </MenuItem>
              <MenuItem value="Hembra">Hembra</MenuItem>
              <MenuItem value="Macho">Macho</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} sm={6} md={8}>
            <Typography>Imagen de la mascota</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              component="label"
              className={styles.upload_image_button}
              endIcon={<UploadIcon />}
            >
              Seleccionar Imagen
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={handleImage}
              />
            </Button>
            {imageName && <Typography>{imageName}</Typography>}
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={12} className={styles.container}>
            <TextField
              className={styles.description_text}
              id="extraDescription"
              label="Agregar una descripción"
              {...register("extraDescription")}
              multiline
              rows={5}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles.question_container}>
          <Grid item xs={10} className={styles.button_container}>
            <Button
              variant="contained"
              className={styles.submit_button}
              type="submit"
            >
              Enviar
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Publicar una mascota en adopción"}
          </DialogTitle>
          <DialogContent className={styles.dialog_container}>
            <Image
              src="/images/huella.webp"
              alt="fingerprint"
              width="154.24px"
              height="60px"
              background="#B224EF"
              transform="rotate(-34.58deg)"
            />
            <DialogContentText
              id="alert-dialog-description"
              className={styles.dialog_text}
            >
              Se ha enviado tu socilitud para publicar una mascota, la
              aprobación se te informará en tu bandeja de notificaciones.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={styles.submit_button}
              autoFocus
              onClick={handleClose}
            >
              OK!
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default withAuth(Giveadoption);
