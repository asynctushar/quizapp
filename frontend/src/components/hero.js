
import Container from "./container";
import heroImg from "../assets/img/hero.png";
import Google from "../assets/google.png";
import Facebook from "../assets/facebook.png";

import Logo from "../assets/logo.png";

const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Ôn tập đúng trọng tâm, rút ngắn thời gian học với phần mềm luyện thi dành riêng cho SAT
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Theo dõi, đánh giá, phân tích bài làm giúp phát bạn hiện điểm yếu và chọn ra lộ trình phù hợp nhất.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href={process.env.REACT_APP_API_URL + "/api/v1/auth/google"}
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md"
              >
                <div className="flex items-center">
                  <img src={Google} alt="Google" className="h-6" />
                  <span className="ml-2 font-medium text-white">Bắt đầu học</span>
                </div>
              </a>
              <a
                href={"https://www.facebook.com/MojiEducation/"}
                className="px-8 py-4 text-lg font-medium text-center text-white border border-indigo-600 rounded-md bg-white"
              >
                <div className="flex items-center">
                  <img src={Facebook} alt="Google" className="h-6" />
                  <span className="ml-2 font-medium text-black">Liên hệ với chúng tôi </span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <img
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
      {/* <Container>
        <div className="flex flex-col justify-center">
          <div className="text-xl text-center text-gray-700 dark:text-white">
            Sản phẩm của <span className="text-indigo-600">Moji Education</span>{" "}
            
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-10 md:justify-around">
            <div className="pt-2 text-gray-400 dark:text-gray-400">
              <AmazonLogo />
            </div>

          </div>
        </div>
      </Container> */}
    </>
  );
}

function AmazonLogo() {
  return (
    <img src={Logo} alt="Amazon Logo" style={{ width: '130px', height: 'auto', marginTop: '-30px' }} />
  );
}

function MicrosoftLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="31"
      fill="none"
      viewBox="0 0 150 31">
      <path
        fill="currentColor"
        d="M150 14.514v-2.647h-3.295V7.75l-.11.034-3.095.945-.061.019v3.118h-4.884V10.13c0-.81.181-1.428.538-1.841.355-.408.863-.615 1.51-.615.465 0 .947.11 1.431.325l.122.054V5.265l-.057-.021c-.452-.162-1.068-.244-1.83-.244-.96 0-1.834.209-2.596.622a4.428 4.428 0 00-1.78 1.757c-.419.751-.631 1.618-.631 2.578v1.91h-2.294v2.647h2.294v11.153h3.293V14.514h4.884v7.088c0 2.919 1.38 4.398 4.1 4.398a6.78 6.78 0 001.4-.155c.488-.105.822-.21 1.018-.322l.043-.026v-2.672l-.134.089c-.204.13-.428.227-.662.288a2.514 2.514 0 01-.65.11c-.638 0-1.11-.171-1.402-.51-.296-.34-.446-.938-.446-1.773v-6.515H150zm-24.387 8.799c-1.195 0-2.137-.396-2.801-1.175-.669-.783-1.007-1.9-1.007-3.317 0-1.464.338-2.61 1.007-3.406.664-.791 1.598-1.193 2.775-1.193 1.142 0 2.05.383 2.702 1.14.654.762.986 1.898.986 3.379 0 1.498-.312 2.65-.928 3.42-.612.764-1.531 1.152-2.734 1.152zm.147-11.779c-2.28 0-4.092.667-5.383 1.982-1.291 1.315-1.945 3.136-1.945 5.41 0 2.161.638 3.9 1.898 5.165 1.26 1.267 2.975 1.908 5.096 1.908 2.21 0 3.986-.676 5.277-2.009 1.29-1.332 1.945-3.135 1.945-5.356 0-2.195-.614-3.946-1.825-5.204-1.211-1.258-2.915-1.896-5.063-1.896zm-12.638 0c-1.551 0-2.834.396-3.815 1.177-.986.785-1.486 1.815-1.486 3.062 0 .647.108 1.223.32 1.711.214.49.545.921.985 1.283.436.359 1.11.735 2.001 1.117.75.308 1.31.569 1.665.774.347.201.594.404.733.6.135.193.204.457.204.783 0 .927-.696 1.378-2.128 1.378-.53 0-1.136-.11-1.8-.329a6.76 6.76 0 01-1.844-.932l-.136-.098v3.164l.05.023c.466.215 1.053.396 1.746.538a9.428 9.428 0 001.864.215c1.684 0 3.04-.398 4.028-1.183.996-.79 1.5-1.845 1.5-3.135 0-.93-.271-1.728-.807-2.37-.531-.639-1.454-1.225-2.74-1.743-1.026-.41-1.683-.751-1.954-1.013-.261-.253-.394-.61-.394-1.063 0-.401.164-.723.5-.983.339-.262.81-.395 1.401-.395.55 0 1.11.087 1.669.256.517.15 1.008.378 1.457.674l.134.092v-3.001l-.051-.022c-.378-.162-.875-.3-1.48-.412a9.053 9.053 0 00-1.622-.168zM99.236 23.313c-1.195 0-2.138-.396-2.802-1.175-.668-.783-1.006-1.899-1.006-3.317 0-1.464.338-2.61 1.007-3.406.664-.791 1.597-1.193 2.774-1.193 1.142 0 2.05.383 2.702 1.14.655.762.987 1.898.987 3.379 0 1.498-.313 2.65-.929 3.42-.611.764-1.53 1.152-2.733 1.152zm.147-11.779c-2.281 0-4.093.667-5.384 1.982-1.29 1.315-1.945 3.136-1.945 5.41 0 2.162.64 3.9 1.9 5.165C95.213 25.358 96.927 26 99.048 26c2.21 0 3.986-.676 5.277-2.009 1.29-1.332 1.945-3.135 1.945-5.356 0-2.195-.614-3.946-1.825-5.204-1.212-1.258-2.916-1.896-5.063-1.896l.001-.001zm-12.328 2.723v-2.39h-3.253v13.8h3.253v-7.06c0-1.2.273-2.186.811-2.93.531-.737 1.24-1.11 2.104-1.11.293 0 .622.049.978.144.353.095.608.198.759.306l.136.099v-3.273l-.052-.022c-.303-.129-.732-.194-1.274-.194-.818 0-1.55.263-2.176.779-.55.453-.947 1.075-1.251 1.85h-.035v.001zm-9.079-2.723c-1.492 0-2.823.32-3.955.95a6.4 6.4 0 00-2.61 2.676c-.594 1.143-.896 2.478-.896 3.966 0 1.304.293 2.5.871 3.555a6.114 6.114 0 002.435 2.456c1.035.573 2.231.863 3.556.863 1.546 0 2.866-.309 3.924-.917l.043-.024v-2.974l-.137.1a6.12 6.12 0 01-1.591.826c-.575.2-1.1.302-1.56.302-1.276 0-2.3-.399-3.044-1.185-.746-.786-1.123-1.891-1.123-3.281 0-1.4.394-2.533 1.17-3.369.775-.833 1.802-1.256 3.052-1.256 1.069 0 2.11.361 3.096 1.075l.137.098v-3.133l-.044-.025c-.371-.207-.877-.378-1.505-.508a9.005 9.005 0 00-1.819-.195zm-9.701.333h-3.253v13.8h3.253v-13.8zm-1.593-5.879c-.536 0-1.003.182-1.386.542a1.786 1.786 0 00-.581 1.354c0 .529.193.975.575 1.327.379.351.847.529 1.392.529a2.01 2.01 0 001.398-.528 1.729 1.729 0 00.582-1.328c0-.518-.19-.969-.566-1.339-.375-.37-.851-.557-1.414-.557zm-8.117 4.86v14.819h3.32V6.41H57.29l-5.84 14.302L45.782 6.41H41v19.256h3.12v-14.82h.107l5.985 14.82h2.354l5.892-14.818h.107z"></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15 14H0V0h15v14zm17 0H17V0h15v14zM15 31H0V17h15v14zm17 0H17V17h15v14z"
        clipRule="evenodd"></path>
    </svg>
  );
}

function NetflixLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="108"
      height="29"
      fill="none"
      viewBox="0 0 108 29">
      <g>
        <path
          fill="currentColor"
          d="M14.714 27.096c-1.61.283-3.248.367-4.942.593L4.603 12.551V28.34c-1.61.17-3.078.395-4.603.621V.04h4.293l5.874 16.409V.039h4.547v27.057zm8.897-16.465c1.75 0 4.434-.085 6.044-.085v4.519c-2.006 0-4.35 0-6.044.085v6.721c2.655-.17 5.31-.395 7.992-.48v4.35l-12.511.988V.039h12.511v4.52h-7.992v6.072zm24.797-6.072h-4.689v20.786c-1.525 0-3.05 0-4.518.056V4.56h-4.688V.039h13.895v4.52zm7.343 5.761h6.185v4.519H55.75V25.09h-4.435V.04h12.625v4.519h-8.19v5.761zm15.533 10.817c2.57.056 5.168.254 7.682.395v4.463c-4.038-.255-8.077-.509-12.2-.594V.04h4.518v21.097zm11.495 5.168c1.44.085 2.965.17 4.434.34V.04h-4.434v26.265zM107.01.04l-5.733 13.754 5.733 15.166c-1.695-.226-3.389-.537-5.084-.819l-3.248-8.36-3.304 7.683c-1.638-.283-3.22-.368-4.857-.594l5.818-13.246L91.082.04h4.858l2.965 7.597L102.07.04h4.942z"></path>
      </g>
    </svg>
  );
}

function SonyLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="136"
      height="24"
      viewBox="0 0 351 61">
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fill="currentColor" fillRule="nonzero">
          <path d="M345.559 49.001a5.448 5.448 0 00-4.81 2.72 5.538 5.538 0 000 5.559 5.448 5.448 0 004.81 2.719 5.425 5.425 0 003.855-1.618A5.513 5.513 0 00351 54.487c0-1.454-.573-2.85-1.593-3.879a5.42 5.42 0 00-3.848-1.607zm0 10.337a4.774 4.774 0 01-3.4-1.42 4.85 4.85 0 01-1.399-3.43c0-1.282.507-2.51 1.407-3.415a4.768 4.768 0 013.392-1.409c1.269 0 2.485.509 3.383 1.413a4.84 4.84 0 011.4 3.41 4.847 4.847 0 01-1.393 3.427 4.77 4.77 0 01-3.39 1.424z"></path>
          <path d="M348.163 53.183c0-.503-.223-1.032-.67-1.285-.45-.265-.952-.291-1.456-.291h-2.604v5.958h.729v-2.748h1.344l1.706 2.748h.868l-1.805-2.748c1.065-.03 1.888-.462 1.888-1.634zm-2.882 1.06h-1.121v-2.107h1.706c.742 0 1.556.112 1.556 1.034.002 1.213-1.303 1.073-2.14 1.073zm-31.199-29.868l10.93-11.639c.634-.854.95-1.453.95-1.965 0-.854-.738-1.196-3.055-1.196h-2.758V2.227H350v7.348h-3.922c-4.53 0-5.371.682-11.691 8.628l-17.292 18.622V48.19c0 2.907 1.472 3.93 5.686 3.93h6.529v7.09H287.5v-7.09h6.527c4.211 0 5.687-1.023 5.687-3.93V36.825l-20.366-22.468c-3.366-3.928-2.9-4.782-12.271-4.782V2.227h37.811v7.348h-2.692c-2.74 0-3.9.512-3.9 1.536 0 .857.842 1.54 1.369 2.222l10.304 11.199c1.224 1.27 2.718 1.434 4.113-.157zM60.388 2.225h9.12v20.503h-8.423c-.746-4.099-3.318-5.693-5.664-7.844-4.231-3.877-13.395-7.106-21.102-7.106-9.948 0-18.344 3.077-18.344 7.602 0 12.56 56.892 2.565 56.892 26.314C72.867 54.08 60.68 61 38.796 61c-7.577 0-19.041-2.345-25.805-5.927-2.12-1.22-3.02 1.156-3.418 4.134H.22V38.02h8.46c1.865 5.383 4.435 6.491 6.8 8.628 4.101 3.76 13.865 6.496 22.82 6.408 13.5-.133 18.142-3.076 18.142-7.348 0-4.27-4.591-5.297-19.385-7.602l-12.562-2.051C10.321 33.918 0 30.758 0 19.482 0 7.778 13.056.43 33.7.43c8.699 0 15.977 1.16 22.963 5.097 1.934 1.254 3.75 1.404 3.725-3.302zM238.39 36.552l.18-22.787c0-2.99-1.56-4.015-6.016-4.015h-5.236V2.66h33.315v7.09h-4.342c-4.46 0-6.02 1.027-6.02 4.015V59.64l-13.04-.103-42.228-39.878v28.96c0 2.906 1.56 4.015 6.017 4.015h5.797v7.006h-34.6v-7.006h5.733c4.456 0 6.016-1.11 6.016-4.014V13.765c0-2.99-1.56-4.015-6.016-4.015h-5.733V2.66h29.914l36.26 33.892zM126.796 0c-26.551 0-43.172 11.706-43.172 30.498 0 18.456 16.39 30.072 42.362 30.072 27.586 0 43.632-11.446 43.632-31.01C169.62 11.962 152.304 0 126.796 0zm-.604 53.14c-14.697 0-23.145-8.459-23.145-23.068 0-14.266 8.816-22.724 23.88-22.724 14.451 0 22.899 8.63 22.899 23.324 0 14.352-8.572 22.468-23.634 22.468z"></path>
        </g>
      </g>
    </svg>
  );
}

function VerizonLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="138"
      height="31"
      viewBox="0 0 658 146">
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g>
          <path
            fill="currentColor"
            d="M642.7 0L606.8 76.8 593.3 47.7 578.7 47.7 600.9 95.3 612.7 95.3 657.2 0z"></path>
          <path
            fill="currentColor"
            fillRule="nonzero"
            d="M488.7 142.6h28.9V89.7c0-12.1 7-20.6 17.4-20.6 10 0 15.2 7 15.2 17.1v56.4h28.9V80.7c0-21-12.6-35.8-33-35.8-13 0-22.1 5.6-28.9 15.8h-.6v-13h-28l.1 94.9zm-56.8-97.5c-30.2 0-50.4 21.7-50.4 50.3 0 28.4 20.2 50.3 50.4 50.3s50.4-21.9 50.4-50.3c.1-28.6-20.2-50.3-50.4-50.3zm-.2 79.2c-13.7 0-21-11.5-21-28.9 0-17.6 7.2-28.9 21-28.9 13.7 0 21.3 11.3 21.3 28.9.1 17.4-7.5 28.9-21.3 28.9zm-132.6 18.3h81.2v-22.8h-46v-.6l44-49.3V47.6h-79.2v22.9h44.5v.6l-44.5 49.7v21.8zm-37.1 0h29.1V47.7H262v94.9zm-67.5 0h29V99c0-19.8 11.9-28.6 30-26.1h.6v-25c-1.5-.6-3.2-.7-5.9-.7-11.3 0-18.9 5.2-25.4 16.3h-.6V47.7h-27.7v94.9zm-53.2-18.2c-12.8 0-20.6-8.3-22.1-21.1h68.4c.2-20.4-5.2-36.7-16.5-46.9-8-7.4-18.5-11.5-31.9-11.5-28.6 0-48.4 21.7-48.4 50.1 0 28.6 18.9 50.4 50.3 50.4 11.9 0 21.3-3.2 29.1-8.5 8.3-5.7 14.3-14.1 15.9-22.4h-27.8c-2.7 6.2-8.5 9.9-17 9.9zm-1.5-58.8c10.2 0 17.2 7.6 18.4 18.7h-38.8c2.3-11.2 8.4-18.7 20.4-18.7zM33 142.6h30.4l33-94.9H67.3l-18.5 61h-.4l-18.5-61H0l33 94.9zM262 13.9h29.1v25.8H262V13.9z"></path>
        </g>
      </g>
    </svg>
  );
}

export default Hero;