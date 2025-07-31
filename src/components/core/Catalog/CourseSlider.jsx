import {Swiper,SwiperSlide} from 'swiper/react'
import {FreeMode ,Pagination} from 'swiper/modules'
import Course_Card from './Course_Card'
import 'swiper/css'

const CourseSlider = ({courses}) => {
  console.log("Courses",courses)
  return (
    <div className='swiper swiper-initialized swiper-horizontal swiper-free-mode mySwiper md:pt-5 swiper-backface-hidden'>
      {
        courses.length ?(
          <Swiper 
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
            className="max-h-[30rem]"
          >
            {
              courses?.map((course)=>(
                <SwiperSlide key={course.id}>

                  <Course_Card course={course} height='h-[250px]'/>
                  
                </SwiperSlide>
              ))
            }
          </Swiper>
        ):(<p className='text-xl text-richblack-5'>No Course found</p>)
      }
    </div>
  )
}

export default CourseSlider