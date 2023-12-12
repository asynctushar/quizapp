import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../assets/sat1.jpeg";
import benefitTwoImg from "../assets/img/benefit-two.png";

const benefitOne = {
  title: "Tính năng",
  desc: "Với nhiều năm kinh nghiệm luyện thi SAT, các mentor của Moji hiểu rằng lý do nhiều bạn rất chăm cày đề nhưng vẫn không đạt mục tiêu là do không biết mình yếu ở đâu để ôn cho hiệu quả.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Phát hiện những dạng bài học viên đang yếu",
      desc: "Dựa vào kết quả và quá trình làm bài, phần mềm có thể biết được học viên đang kém những dạng nào để có thể ôn tập và cải thiện",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Phát hiện những kỹ năng còn thiếu",
      desc: "Đi kèm với những dạng bài là rất nhiều những kỹ năng khác nhau có thể được trau dồi để làm bài thi một cách tốt nhất",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Phát hiện những phương pháp làm bài chưa tốt",
      desc: "Bạn hay làm bài ẩu, chưa biết quản lý thời gian? Chúng tôi sẽ giúp học viên phát hiện để cải thiện chiến thuật làm bài thi",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Ưu điểm",
  desc: "Từ dữ liệu của chúng tôi, các bạn có thể lưu ý để luyện tập cụ thể những dạng bài, những kỹ năng mình đang kém thay vì phí thời gian vào làm cả đề thi.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Nguồn bài thi luôn được cập nhật",
      desc: "Đội ngũ của Moji liên tục phát triển và thêm những bài thi mới vào kho đề thi của ứng dụng",
      icon: <SunIcon />,
    },
    {
      title: "Nhận bài chữa ngay sau khi hoàn thành bài thi ",
      desc: "Chữa đáp án chi tiết giúp bạn hiểu lỗi sai của mình ngay lập tức",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Lưu lại kết quả ôn tập",
      desc: "Giúp bạn theo dõi tiến độ, quá trình ôn tập của bản thân",
      icon: <AdjustmentsHorizontalIcon />,
    },
    
  ],
};


export {benefitOne, benefitTwo};
