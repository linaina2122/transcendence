import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  EffectCoverflow,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
// import "swiper/css/scrollbar";

// install Swiper modules

import "./TeamStyle.css"

function Team() {
  return (
    <section id="team" className="teams">
      <div className="container">
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Autoplay, A11y, EffectCoverflow]}
          spaceBetween={20}
          slidesPerView={3}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          // onSwiper={(swiper) => console.log(swiper)}
          // onSlideChange={() => console.log("slide change")}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="mySwiper"
          // slidesPerView={3}
          // centeredSlides="true"
          effect="coverflow"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
          }}
        >
          <SwiperSlide className="member-card">
            <div className="member-card-header">
              <div className="member-img">
                <img
                  src="/images/team/oualid-oulmyr.jpeg"
                  alt="image profile"
                />
              </div>
            </div>
            <div className="member-card-body">
              <div className="member-fullname">Oulmyr Oualid</div>
              <div className="member-username">ooulmyr</div>
              <div className="member-mission">Frontend Developer</div>
            </div>
            <div className="member-card-footer">
              <div className="member-social-media">
                <a href="#">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-github"></i>{" "}
                </a>
                <a href="#">
                  {/* <svg
                      version="1.1"
                      id="Calque_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 137.6 96.599998"
                      enableBackground="new 0 0 595.3 841.9"
                      width="100%"
                      height="100%"
                      className="company-logo"
                    >
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-custom-link"
                      />
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-general-link"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-custom-style"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-native-style"
                      />

                      <defs id="defs15" />

                      <g id="g3" transform="translate(-229.2,-372.70002)">
                        <polygon
                          points="229.2,443.9 279.9,443.9 279.9,469.3 305.2,469.3 305.2,423.4 254.6,423.4 305.2,372.7 279.9,372.7 229.2,423.4 "
                          id="polygon5"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="316.1,398.1 341.4,372.7 316.1,372.7 "
                          id="polygon7"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="341.4,398.1 316.1,423.4 316.1,448.7 341.4,448.7 341.4,423.4 366.8,398.1 366.8,372.7 341.4,372.7 "
                          id="polygon9"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="366.8,423.4 341.4,448.7 366.8,448.7 "
                          id="polygon11"
                          style="fill: #ffffff"
                        />
                      </g>
                    </svg> */}
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="member-card">
            <div className="member-card-header">
              <div className="member-img">
                <img src="/images/team/hajar-charef.jpeg" alt="image profile" />
              </div>
            </div>
            <div className="member-card-body">
              <div className="member-fullname">Hajar Charef</div>
              <div className="member-username">hcharef</div>
              <div className="member-mission">Game Developer</div>
            </div>
            <div className="member-card-footer">
              <div className="member-social-media">
                <a href="#">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-github"></i>{" "}
                </a>
                <a href="#">
                  {/* <svg
                      xmlns:dc="http://purl.org/dc/elements/1.1/"
                      xmlns:cc="http://creativecommons.org/ns#"
                      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                      xmlns:svg="http://www.w3.org/2000/svg"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                      version="1.1"
                      id="Calque_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 137.6 96.599998"
                      enable-background="new 0 0 595.3 841.9"
                      xml:space="preserve"
                      inkscape:version="0.48.2 r9819"
                      width="100%"
                      height="100%"
                      className="company-logo"
                      sodipodi:docname="42_logo.svg"
                    >
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-custom-link"
                      />
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-general-link"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-custom-style"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-native-style"
                      />
                      <metadata id="metadata17">
                        <rdf:RDF>
                          <cc:Work rdf:about="">
                            <dc:format>image/svg+xml</dc:format>
                            <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                          </cc:Work>
                        </rdf:RDF>
                      </metadata>
                      <defs id="defs15" />
                      <sodipodi:namedview
                        pagecolor="#ffffff"
                        bordercolor="#666666"
                        borderopacity="1"
                        objecttolerance="10"
                        gridtolerance="10"
                        guidetolerance="10"
                        inkscape:pageopacity="0"
                        inkscape:pageshadow="2"
                        inkscape:window-width="1060"
                        inkscape:window-height="811"
                        id="namedview13"
                        showgrid="false"
                        fit-margin-top="0"
                        fit-margin-left="0"
                        fit-margin-right="0"
                        fit-margin-bottom="0"
                        inkscape:zoom="0.39642998"
                        inkscape:cx="68.450005"
                        inkscape:cy="48.350011"
                        inkscape:window-x="670"
                        inkscape:window-y="233"
                        inkscape:window-maximized="0"
                        inkscape:current-layer="Calque_1"
                      />
                      <g id="g3" transform="translate(-229.2,-372.70002)">
                        <polygon
                          points="229.2,443.9 279.9,443.9 279.9,469.3 305.2,469.3 305.2,423.4 254.6,423.4 305.2,372.7 279.9,372.7 229.2,423.4 "
                          id="polygon5"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="316.1,398.1 341.4,372.7 316.1,372.7 "
                          id="polygon7"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="341.4,398.1 316.1,423.4 316.1,448.7 341.4,448.7 341.4,423.4 366.8,398.1 366.8,372.7 341.4,372.7 "
                          id="polygon9"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="366.8,423.4 341.4,448.7 366.8,448.7 "
                          id="polygon11"
                          style="fill: #ffffff"
                        />
                      </g>
                    </svg> */}
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="member-card">
            <div className="member-card-header">
              <div className="member-img">
                <img
                  src="/images/team/abdelmoumen-el-mahmoudy.jpeg"
                  alt="image profile"
                />
              </div>
            </div>
            <div className="member-card-body">
              <div className="member-fullname">Abdelmoumen El Mahmoudi</div>
              <div className="member-username">ael-mahm</div>
              <div className="member-mission">backend Developer</div>
            </div>
            <div className="member-card-footer">
              <div className="member-social-media">
                <a href="#">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-github"></i>{" "}
                </a>
                <a href="#">
                  {/* <svg
                      xmlns:dc="http://purl.org/dc/elements/1.1/"
                      xmlns:cc="http://creativecommons.org/ns#"
                      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                      xmlns:svg="http://www.w3.org/2000/svg"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                      version="1.1"
                      id="Calque_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 137.6 96.599998"
                      enable-background="new 0 0 595.3 841.9"
                      xml:space="preserve"
                      inkscape:version="0.48.2 r9819"
                      width="100%"
                      height="100%"
                      className="company-logo"
                      sodipodi:docname="42_logo.svg"
                    >
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-custom-link"
                      />
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-general-link"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-custom-style"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-native-style"
                      />
                      <metadata id="metadata17">
                        <rdf:RDF>
                          <cc:Work rdf:about="">
                            <dc:format>image/svg+xml</dc:format>
                            <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                          </cc:Work>
                        </rdf:RDF>
                      </metadata>
                      <defs id="defs15" />
                      <sodipodi:namedview
                        pagecolor="#ffffff"
                        bordercolor="#666666"
                        borderopacity="1"
                        objecttolerance="10"
                        gridtolerance="10"
                        guidetolerance="10"
                        inkscape:pageopacity="0"
                        inkscape:pageshadow="2"
                        inkscape:window-width="1060"
                        inkscape:window-height="811"
                        id="namedview13"
                        showgrid="false"
                        fit-margin-top="0"
                        fit-margin-left="0"
                        fit-margin-right="0"
                        fit-margin-bottom="0"
                        inkscape:zoom="0.39642998"
                        inkscape:cx="68.450005"
                        inkscape:cy="48.350011"
                        inkscape:window-x="670"
                        inkscape:window-y="233"
                        inkscape:window-maximized="0"
                        inkscape:current-layer="Calque_1"
                      />
                      <g id="g3" transform="translate(-229.2,-372.70002)">
                        <polygon
                          points="229.2,443.9 279.9,443.9 279.9,469.3 305.2,469.3 305.2,423.4 254.6,423.4 305.2,372.7 279.9,372.7 229.2,423.4 "
                          id="polygon5"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="316.1,398.1 341.4,372.7 316.1,372.7 "
                          id="polygon7"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="341.4,398.1 316.1,423.4 316.1,448.7 341.4,448.7 341.4,423.4 366.8,398.1 366.8,372.7 341.4,372.7 "
                          id="polygon9"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="366.8,423.4 341.4,448.7 366.8,448.7 "
                          id="polygon11"
                          style="fill: #ffffff"
                        />
                      </g>
                    </svg> */}
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="member-card">
            <div className="member-card-header">
              <div className="member-img">
                <img
                  src="/images/team/yassine-bouali.jpeg"
                  alt="image profile"
                />
              </div>
            </div>
            <div className="member-card-body">
              <div className="member-fullname">Yassine Bouali</div>
              <div className="member-username">ybouali</div>
              <div className="member-mission">Full stack web developer</div>
            </div>
            <div className="member-card-footer">
              <div className="member-social-media">
                <a href="#">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-github"></i>{" "}
                </a>
                <a href="#">
                  {/* <svg
                      xmlns:dc="http://purl.org/dc/elements/1.1/"
                      xmlns:cc="http://creativecommons.org/ns#"
                      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                      xmlns:svg="http://www.w3.org/2000/svg"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                      version="1.1"
                      id="Calque_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 137.6 96.599998"
                      enable-background="new 0 0 595.3 841.9"
                      xml:space="preserve"
                      inkscape:version="0.48.2 r9819"
                      width="100%"
                      height="100%"
                      className="company-logo"
                      sodipodi:docname="42_logo.svg"
                    >
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-custom-link"
                      />
                      <link
                        xmlns=""
                        type="text/css"
                        rel="stylesheet"
                        id="dark-mode-general-link"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-custom-style"
                      />
                      <style
                        xmlns=""
                        lang="en"
                        type="text/css"
                        id="dark-mode-native-style"
                      />
                      <metadata id="metadata17">
                        <rdf:RDF>
                          <cc:Work rdf:about="">
                            <dc:format>image/svg+xml</dc:format>
                            <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                          </cc:Work>
                        </rdf:RDF>
                      </metadata>
                      <defs id="defs15" />
                      <sodipodi:namedview
                        pagecolor="#ffffff"
                        bordercolor="#666666"
                        borderopacity="1"
                        objecttolerance="10"
                        gridtolerance="10"
                        guidetolerance="10"
                        inkscape:pageopacity="0"
                        inkscape:pageshadow="2"
                        inkscape:window-width="1060"
                        inkscape:window-height="811"
                        id="namedview13"
                        showgrid="false"
                        fit-margin-top="0"
                        fit-margin-left="0"
                        fit-margin-right="0"
                        fit-margin-bottom="0"
                        inkscape:zoom="0.39642998"
                        inkscape:cx="68.450005"
                        inkscape:cy="48.350011"
                        inkscape:window-x="670"
                        inkscape:window-y="233"
                        inkscape:window-maximized="0"
                        inkscape:current-layer="Calque_1"
                      />
                      <g id="g3" transform="translate(-229.2,-372.70002)">
                        <polygon
                          points="229.2,443.9 279.9,443.9 279.9,469.3 305.2,469.3 305.2,423.4 254.6,423.4 305.2,372.7 279.9,372.7 229.2,423.4 "
                          id="polygon5"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="316.1,398.1 341.4,372.7 316.1,372.7 "
                          id="polygon7"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="341.4,398.1 316.1,423.4 316.1,448.7 341.4,448.7 341.4,423.4 366.8,398.1 366.8,372.7 341.4,372.7 "
                          id="polygon9"
                          style="fill: #ffffff"
                        />
                        <polygon
                          points="366.8,423.4 341.4,448.7 366.8,448.7 "
                          id="polygon11"
                          style="fill: #ffffff"
                        />
                      </g>
                    </svg> */}
                </a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </section>
  )
}

export default Team
