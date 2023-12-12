import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-indigo-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
}

const faqdata = [
  {
    question: "Phần mềm này có miễn phí không?",
    answer: "Hiện tại các bạn có thể sử dụng phần mềm và làm toàn bộ các đề thi mà không mất phí",
  },
  {
    question: "Phần mềm này đánh giá kết quả học viên như thế nào?",
    answer: "Tận dụng tối đa cách bài thi SAT được thiết kế, kết quả bài làm, cũng như bản thân quá trình làm bài của học viên để tìm ra những lỗi sai trong quá trình làm bài",
  },
  {
    question: "Sau khi nhận được phân tích kết quả thi thì làm gì để cải thiện? ",
    answer:
      "Việc đầu tiên các bạn nên làm là chọn làm thêm các dạng bài mà phần mềm gợi ý, hoặc đăng ký khoá SAT của Moji Educaition để nhận được hướng dẫn chi tiết từ các mentor nhé.",
  },
  {
    question: "Đăng nhập bằng tài khoản Google có an toàn không? Có cách nào khác để đăng nhập không? ",
    answer:
      "Hệ thống này do Google quản lý và chúng mình đã khai báo với Google nên không có gì cần lo, ngoài ra chúng mình không nhận được bất kì thông tin gì của các bạn ngoại trừ email nhé.",
  },
];

export default Faq;