
import React from "react";
import Container from "./container";

import userOneImg from "../assets/img/user1.jpeg";
import userTwoImg from "../assets/img/user2.jpeg";


const Testimonials  = () => {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2">
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
          <Avatar
              image={userOneImg}
              name="Nguyễn Trần Nguyên Anh"
              title="Co-founder tại Moji Education"
            />
             <p className="text-1xl leading-normal mt-5">
              <Mark>3 năm</Mark> kinh nghiệm mentor SAT tại Moji Education
            </p>
            <p className="text-1xl leading-normal mt-2">
               Sinh viên ngành khoa học Máy tính và khoa học Giáo dục tại Colby College
            </p>
           
          </div>
        </div>
          
        
        <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
          <Avatar
              image={userTwoImg}
              name="Hà Tuấn Hùng"
              title="Co-founder tại Moji Education"
            />
             <p className="text-1xl leading-normal mt-5 ">
              <Mark>3 năm</Mark> kinh nghiệm mentor SAT tại Moji Education
            </p>
            <p className="text-1xl leading-normal mt-2">
               Sinh viên ngành Sân khấu và Văn học so sánh tại Williams College
            </p>        
          </div>
          </div>
    </Container>
  );
}

function Avatar(props) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full">
        <img
          src={props.image}
          width="55"
          height="55"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props) {
  return (
    <>
      {" "}
      <mark className="text-indigo-800 bg-indigo-100 rounded-md ring-indigo-100 ring-4 dark:ring-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
        {props.children}
      </mark>{" "}
    </>
  );
}

export default Testimonials;