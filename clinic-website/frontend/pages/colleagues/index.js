import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/ColleaguesPage.module.scss';

import ContentContainer from '../../components/ContentContainer/ContentContainer';
import Colleague from '../../components/Colleague/Colleague';
import { RiUserAddLine } from 'react-icons/ri';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

const ColleaguesPage = () => {
  const [colleagues, setColleagues] = useState();
  const [formShow, setFormShow] = useState(false);
  const [values, setValues] = useState({});
  const [error, setError] = useState({});
  const [length, setLength] = useState(colleagues?.length);

  const errors = {
    name: 'لطفا فیلد نام و نام خانوادگی را تکمیل کنید.',
    jobTitle: 'لطفا فیلد عنوان شغلی را تکمیل کنید.',
    password: 'لطفا برای کاربر رمز عبور مشخص کنید.',
    repeatPassword: 'تکرار رمز عبور با رمز عبور یکسان نمی باشد!',
  }
  useEffect(() => {
    axios.get('http://localhost:4500/Psychologist/getlist')
      .then(response => {
        //console.log("response", response);
        setColleagues(response.data.list);
      }).catch(error => {
        //console.log("error", error);
      })
  }, [length])

  const changeHandler = (event) => {
    let temp = { ...values };
    temp[event.target.name] = event.target.value;
    setValues(temp);
  }

  const blurHandler = (event) => {
    let temp = { ...error };
    if (event.target.value === '') {
      temp[event.target.name] = errors[event.target.name];
      setError(temp);
    } else {
      temp[event.target.name] = '';
      setError(temp);
    }

  }

  const validationHandler = () => {
    let name = '', jobTitle = '', password = '';
    let temp = { ...error };
    if (values.name === undefined || values.name === '') {
      name = errors.name;
    }
    if (values.jobTitle === undefined || values.jobTitle === '') {
      jobTitle = errors.jobTitle;
    }
    if (values.password === undefined || values.password === '') {
      password = errors.password;
    }
    if (values.repeatPassword !== values.password) {
      password = errors.repeatPassword;
    }
    if (name !== '' || jobTitle !== '' || password !== '') {
      temp.name = name;
      temp.jobTitle = jobTitle;
      temp.password = password;
      setError(temp);
      return false;
    } else {
      setError({});
      return true;
    };
  }

  const addColleagueHandler = (event) => {
    event.preventDefault();
    const isValid = validationHandler();
    if (isValid) {
      const data = {
        ...values,
        link: 'colleague' + colleagues?.length
      }
      axios.post('http://localhost:4500/Psychologist/add', data)
        .then(response => {
          //console.log("response", response);
          setLength(colleagues.length);
          setFormShow(false);
        }).catch(error => {
          console.log("error", error.response.data);
          setError({ server: error.response.data.errortext })
        })
      setError({});
    }
  }

  const inputProperties = {
    name: {
      config: {
        placeholder: 'نام و نام خانوادگی',
        name: 'name',
        value: values.name
      },
      Label: 'نام و نام خانوادگی:',
      changeHandler,
      blurHandler
    },
    email: {
      config: {
        placeholder: 'example@example.com',
        name: 'email',
        value: values.email
      },
      Label: 'ایمیل:',
      changeHandler,
      blurHandler
    },
    jobTitle: {
      config: {
        placeholder: 'عنوان شغلی',
        name: 'jobTitle',
        value: values.jobTitle
      },
      changeHandler,
      blurHandler
    },
    education: {
      config: {
        placeholder: 'تحصیلات',
        name: 'education',
        value: values.education
      },
      changeHandler,
      blurHandler
    },
    introduction: {
      config: {
        type: 'textarea',
        placeholder: 'توضیحات',
        name: 'introduction',
        value: values.introduction
      },
      Label: 'توضیحات:',
      changeHandler,
      blurHandler
    },
    password: {
      config: {
        type: 'password',
        placeholder: 'رمز عبور',
        name: 'password'
      },
      changeHandler,
      blurHandler
    },
    repeatPassword: {
      config: {
        type: 'password',
        placeholder: 'تکرار رمز عبور',
        name: 'repeatPassword'
      },
      changeHandler,
      blurHandler
    },

  }

  //console.log("values", values);
  console.log("error", error);
  return (
    <div className={styles.ColleaguesPage}>
      <ContentContainer Title='رزومه‌ی همکاران' UnderLine>
        <div className={styles.Colleagues}>
          {colleagues?.map((colleague, index) => {
            return <Colleague
              key={index}
              Name={colleague.name}
              JobTitle={colleague.jobTitle}
              Link={colleague.link}
              Education={colleague.education}
              Introduction={colleague.introduction}
              Email={colleague.email}
            />
          })}
          <div className={styles.AddColleague}>
            <button onClick={() => setFormShow(true)}><RiUserAddLine /></button>
          </div>
        </div>

      </ContentContainer >
      {formShow &&
        <div className={styles.ModalContainer}>
          <div className={styles.Backdrop} onClick={() => setFormShow(false)}></div>
          <div className={styles.Modal}>

            <h3 style={error.server && { color: '#ff4040' }}>{error.server ? error.server : 'افزودن همکار جدید'}</h3>
            <form onSubmit={(event) => addColleagueHandler(event)} autoComplete='off'>
              <Input inputProperties={inputProperties.name} Error={error.name} Required />
              <Input inputProperties={inputProperties.email} />
              <div>
                <Input inputProperties={inputProperties.jobTitle} Error={error.jobTitle} Required/>
                <Input inputProperties={inputProperties.education} />
              </div>
              <Input inputProperties={inputProperties.introduction} />
              <div className={styles.Passwords}>
                <span>رمز عبور:</span>
                <Input inputProperties={inputProperties.password} Error={error.password} Required/>
                <Input inputProperties={inputProperties.repeatPassword} />
              </div>
              <div className={styles.Buttons}>
                <Button type='button' clicked={() => { setFormShow(false); setValues({}) }} Cancel>انصراف</Button>
                <Button type='submit'>تایید</Button>
              </div>
            </form>

          </div>
        </div>
      }
    </div>
  )
    ;
};

export default ColleaguesPage;
