import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { getPost, updatePost } from "@/lib/posts";
import { Grid, Stack, Box, Typography, Container } from "@mui/material";
import PostCover from "@/components/PostDetails/PostCover";
import PostInformation from "@/components/PostDetails/PostInformation";
import Comments from "@/components/PostDetails/Comments";
import { PostInfoFormModal } from "@/components/Modals/PostInfoFormModal";
import { useAlert } from "@/lib/alert";
import NOTIFICATIONS from "src/constants/notifications";
import { createNotification } from "@/lib/notifications";
import Routes from "src/constants/routes";
import PETTYPE from "src/constants/petType";
import DeletePostImage from "../../../../public/images/delete-post.webp";
import Image from "next/image";
import styles from "@/styles/postDeleted.module.css";

function Post() {
  const router = useRouter();
  const { addAlert } = useAlert();
  const {
    query: { id },
  } = router;
  const [postData, setPostData] = useState(null);
  const [openPostForm, setOpenPostForm] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const getPostData = async () => {
      const post = await getPost(id);
      setPostData(post);
    };
    id && getPostData();
  }, [id]);

  const handleAction = async (action) => {
    try {
      await updatePost({ data: { status: action }, id });
      addAlert({
        text: "Publicación actualizada",
        severity: "success",
        duration: 6000,
      });
      postData?.petType === PETTYPE.GATO
        ? push(Routes.ADMIN_CATS)
        : postData?.petType === PETTYPE.PERRO
        ? push(Routes.ADMIN_DOGS)
        : push(Routes.ADMIN_OTHER);
    } catch (e) {
      console.log({ e });
      addAlert({
        text: "Error al actualizar la publicación",
        severity: "error",
        duration: 6000,
      });
    }
    try {
      await createNotification(
        postData?.userId,
        action === "ACCEPTED"
          ? NOTIFICATIONS.ACCEPTED_POST
          : NOTIFICATIONS.REJECTED_POST,
        postData?.id
      );
      handleClosePostFormModal();
    } catch (e) {
      console.log(e);
    }
  };

  const handleClosePostFormModal = () => setOpenPostForm(false);

  return (
    <>
      {postData === undefined ? (
        <Box className={styles.image_container}>
          <Grid
            container
            item
            xs={12}
            sm={12}
            className={styles.image_container}
          >
            <Image
              alt="logo-mascota"
              src={DeletePostImage}
              width={490}
              height={530}
            />
          </Grid>
        </Box>
      ) : (
        postData && (
          <>
            <Grid container marginTop={3}>
              <Grid item xs={12} sm={12} md={4}>
                <PostCover
                  petImage={postData.image}
                  petName={postData.petName}
                  userId={postData.userId}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={8}
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                <PostInformation
                  id={id}
                  petName={postData.petName}
                  petSex={postData.petSex}
                  petAge={postData.petAge}
                  petSize={postData.petSize}
                  description={postData.description}
                  postUserId={postData.userId}
                  petType={postData.petType}
                  setOpenPostForm={setOpenPostForm}
                />
              </Grid>
            </Grid>
            {postData.status === "ACCEPTED" ? (
              <Stack marginTop={5}>
                <Comments postId={id} ownerId={postData.userId} />
              </Stack>
            ) : postData.status === "REJECTED" ? (
              <Container>
                <Typography
                  variant="h6"
                  color="red"
                  textAlign={"center"}
                  marginTop={2}
                >
                  Esta publicación ha sido denegada porque es inapropiada e
                  incumple nuestras normas comunitarias.
                </Typography>
                <Typography variant="h6" color="red" textAlign={"center"}>
                  En el transcurso del día la publicación será eliminada
                  completamente del sistema.
                </Typography>
              </Container>
            ) : (
              ""
            )}

            <PostInfoFormModal
              open={openPostForm}
              handleClose={handleClosePostFormModal}
              formInfo={postData.form}
              handleAction={handleAction}
              postStatus={postData.status}
            />
          </>
        )
      )}
    </>
  );
}

export default Post;
