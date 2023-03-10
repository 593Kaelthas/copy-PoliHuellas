import React, { useEffect, useState } from "react";
import { getPosts } from "@/lib/posts";
import { PetCard } from "@/components/PetCard";
import { CircularProgress, Grid, Box, Typography, Stack } from "@mui/material";
import Image from "next/image";
import styles from "../styles/petPages.module.css";
import PETTYPE from "src/constants/petType";
import { useAuth } from "@/lib/auth";
import PetsIcon from "@mui/icons-material/Pets";
import FilterPostsRadioGroup from "@/components/FilterPostsRadioGroup";
import DontResultImage from "../../public/images/dontresult-other.webp";

export default function Otros() {
  const [otherPosts, setOtherPosts] = useState();
  const { session } = useAuth();
  const [petSex, setPetSex] = useState(null);
  const [petSize, setPetSize] = useState(null);

  console.log({ petSex });
  console.log({ petSize });

  useEffect(() => {
    const getOtherPosts = async () => {
      const status = session
        ? session?.role === "user"
          ? "ACCEPTED"
          : undefined
        : "ACCEPTED";
      let petSexName = petSex?.at(0).toUpperCase() + petSex?.substring(1);
      petSexName = petSexName === "Todos" ? null : petSexName;
      let petSizeName = petSize?.at(0).toUpperCase() + petSize?.substring(1);
      petSizeName = petSizeName === "Todos" ? null : petSizeName;

      const cb = (snapshot) => {
        const others = snapshot.docs;
        setOtherPosts(others.map((doc) => ({ ...doc.data(), id: doc.id })));
      };

      const unsub = getPosts({
        petType: PETTYPE.OTROS,
        status: status,
        petSex: petSexName,
        petSize: petSizeName,
        callback: cb,
      });
      return () => unsub();
    };
    getOtherPosts();
  }, [session, petSex, petSize]);

  return (
    <>
      <Box container className={styles.container}>
        <Image
          src="/images/banner-other.webp"
          alt="cover"
          width="1800px"
          height="580px"
        />
        <Typography className={styles.title}>Sabías que?</Typography>
        <Stack direction="row">
          <PetsIcon className={styles.icon_pet} />
          <Typography className={styles.text}>
            La colita de los conejos es blanca para confundir a los depredadores
            mientras son perseguidos.
          </Typography>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <FilterPostsRadioGroup
            setPetSize={setPetSize}
            setPetSex={setPetSex}
          />
        </Grid>
        <Grid item xs={10}>
          <Grid
            container
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            {otherPosts ? (
              otherPosts?.length > 0 ? (
                otherPosts?.map((post, index) => (
                  <PetCard
                    key={index}
                    postId={post.id}
                    petName={post.petName}
                    petAge={post.petAge}
                    petSex={post.petSex}
                    petImage={post.image}
                  />
                ))
              ) : (
                <Grid
                  container
                  item
                  xs={12}
                  sm={12}
                  className={styles.image_container}
                >
                  <Image
                    alt="logo-mascota"
                    src={DontResultImage}
                    width={420}
                    height={400}
                  />
                </Grid>
              )
            ) : (
              <CircularProgress />
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
