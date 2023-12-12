import React, { useEffect } from "react";
import Google from "../assets/google.png";
import Facebook from "../assets/facebook.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Helmet from "react-helmet";
import Hero from "../components/hero";
import SectionTitle from "../components/sectionTitle";
import Navbar from "../components/Navbar";
import { benefitOne, benefitTwo } from "../components/data";
import Video from "../components/video";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import Cta from "../components/cta";
import Faq from "../components/faq";
import PopupWidget from "../components/popupWidget";

const SignIn = () => {
	const navigate = useNavigate();
	const isAuthenticated = useSelector(
		(state) => state.userState.isAuthenticated,
	);

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [navigate, isAuthenticated]);

	return (
		<>
		  <Helmet>
			<title>Đăng nhập</title>
			<meta
			  name="description"
			  content="Ôn luyện Digital SAT hiệu quả với phần mềm của Moji"
			/>
			<link rel="icon" href="/favicon.ico" />
		  </Helmet>
	
		  <Hero />
		  <SectionTitle
			pretitle="Lợi ích"
			title="Tại sao nên sử dụng Moji SAT?">
			   Theo dõi, đánh giá, phân tích
		  </SectionTitle>
		  <Benefits data={benefitOne} />
		  <Benefits imgPos="right" data={benefitTwo} />
		  <SectionTitle
			pretitle="Đội ngũ"
			title="Những người dẫn đầu dự án">
			 Các mentor với hợn 3 năm kinh nghiệm luyện thi SAT thành công cho hàng trăm học viên
		  </SectionTitle>
		  <Testimonials />
		  <SectionTitle pretitle="FAQ" title="Những câu hỏi thường gặp">
		  </SectionTitle>
		  <Faq />
		  <Footer />
		  
		</>
	  );
	}
	

export default SignIn;