import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'
import styles from './Hero.module.scss';

const HeroContent = [
    {
        ID: 'home',
        image: 'HomePage.png',
        text: 'کلینیـک روانشـناسی سایه',
        subText: 'مجموعه‌ی آموزشی ، پژوهشی ، درمانی'
    },
    {
        ID: 'workshops',
        image: 'workshops.png',
        text: 'کـارگاه‌های آمـوزشی'
    },
    {
        ID: 'colleagues',
        image: 'colleagues.png',
        text: 'رزومـه‌ی همـکاران'
    },
    {
        ID: 'contact-us',
        image: 'contactUs.png',
        text: 'تـمـاس بـا مـا'
    },
    {
        ID: 'about-us',
        image: 'aboutUs.png',
        text: 'دربـاره‌ی ما'
    }
]


const Hero = () => {
    const router = useRouter(null);

    const heroContentHandler = () => {
        let content = HeroContent.find(content => content.ID.includes(router.pathname));

        if (router.pathname === '/') {
            content = HeroContent.find(content => content.ID === 'home');
        }
        else {
            content = HeroContent.find(content => router.pathname.includes(content.ID));
        }
        return content;
    }

    return <div className={styles.Hero}>

        <div className={styles.HeroOval}></div>
        <div className={styles.HeroContent}>
            <div className={styles.Line}></div>
            <h1>{heroContentHandler()?.text}</h1>
            <h5>{heroContentHandler()?.subText}</h5>
            {/* <div className={styles.Line}></div> */}
        </div>
        <div className={styles.Image}>
          
                {heroContentHandler() &&
                    <Image
                        src={(`/images/Hero/${heroContentHandler().image}`)}
                        alt='Setayesh Clinic'
                        layout='fill'
                        objectFit='contain'
                        priority
                    />
                }
            
        </div>
    </div>;
};

export default Hero;
