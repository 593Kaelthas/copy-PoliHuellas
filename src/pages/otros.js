import React,{useEffect, useState} from 'react'
import { getPosts } from '@/lib/posts';
import { PetCard } from '@/components/PetCard';
import {CircularProgress, Grid, Box, Typography } from '@mui/material';
import Image from 'next/image';
import styles from '../styles/PetPages.module.css';
import PETTYPE from 'src/constants/petType';

export default function Otros() {

  const [otherPosts, setOtherPosts] = useState();

  useEffect(() => {
    const getOtherPosts = async () => {
      const posts = await getPosts(PETTYPE.OTROS);
      setOtherPosts(posts);
    }
    getOtherPosts();
  }, []);
  
  return (
    <>
      <Box container className={styles.container}>
      <Image
          src="/images/otro-banner.jpg"
          alt="cover"
          width="3840px"
          height="1240px"
        />
      <Typography className={styles.title}>Sabías que?</Typography>
      <Typography className={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
      </Box>
      <br/>
      <br/>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <h1>Otros</h1>
        </Grid>
        <Grid item xs={10}>
        <Grid container direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} >
            {otherPosts ? otherPosts?.map((post,index) => 
              <PetCard key={index} postId={post.id} petName={post.petName} petAge={post.petAge} petSex={post.petSex} petImage={post.image} />
            ): 
              <CircularProgress />
            }
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
