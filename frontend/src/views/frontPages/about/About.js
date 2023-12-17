/* eslint-disable prettier/prettier */
import React from "react";
import Header from "../navbar/Navbar";
import Footer from "../footer/Footer";

const About = () => {
    return (
        <>
            <div className="container" style={{ marginTop: "170px" }}>
                <div>
                    <Header />
                </div>
                <h1 className="text-center ">
                    <span
                        style={{
                            backgroundImage: "linear-gradient(to bottom, #d0f575, #D4AF37)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            display: "inline-block",
                            fontWeight: "bold",
                            fontSize: '135%'
                        }}
                    >
                        Om oss
                    </span>                    
                </h1>

                <div className="row mt-5">
                    <div className="col-md-6 order-2 order-md-1 mb-5">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjT19xXXrq9c0OJkdgDxuewFihPeLk0uUJBzbbWQ8WZ7cacu7LSt3rDyTygN4AiM1TOP0&usqp=CAU"
                            alt="Gallery Interior"
                            className="img-fluid w-100 h-100 p-2"
                            style={{ borderRadius: "15px" }}
                        />
                    </div>
                    <div className="col-md-6 order-1 order-md-2">
                        <h2>
                            <span
                                style={{
                                    WebkitBackgroundClip: "text",
                                    color: "black",
                                    display: "inline-block",
                                    fontWeight: "bolder",
                                }}
                            >
                                Välkommen till vår plattform för royaltyfria medier
                            </span>
                        </h2>
                        {/* Repeat heading and section so remove the heading */}
                        {/* <h3>Välkommen till vår plattform för royaltyfria medier</h3> */}
                        <p>
                            Vi är glada att välkomna dig till vår plattform där du kan få tillgång till ett omfattande urval av royaltyfria bilder och videor för dina olika kreativa behov. Här strävar vi efter att tillhandahålla högkvalitativt visuellt innehåll för att förbättra dina projekt utan bördan av löpande royaltyavgifter.
                        </p>
                    </div>
                </div>

                <div className="row mt-xl-5">
                    <div className="col-md-6 py-sm-5 ">
                        <h2>  <span
                            style={{
                                WebkitBackgroundClip: "text",
                                color: "black",
                                display: "inline-block",
                                fontWeight: "bold",
                            }}
                        >
                            Vad innebär royaltyfritt?
                        </span></h2>
                        <h3>Förståelse för royaltyfri licensiering</h3>
                        <p>
                            När vi säger `royaltyfri`` betyder det inte att innehållet är helt gratis. Istället innebär det att du, med ett betalt medlemskap inkluderat i din årsavgift, kan använda materialet så mycket du vill utan att betala royalty till upphovsrättsinnehavaren varje gång du använder det.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <img
                            src="https://cdnb.artstation.com/p/marketplace/presentation_assets/002/408/921/large/file.jpg?1675521337"
                            alt="Mission Statement"
                            className="img-fluid w-100 h-100 p-2"
                            style={{ borderRadius: "15px" }}
                        />
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-6 order-2 order-md-1 mb-5">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjT19xXXrq9c0OJkdgDxuewFihPeLk0uUJBzbbWQ8WZ7cacu7LSt3rDyTygN4AiM1TOP0&usqp=CAU"
                            alt="Gallery Interior"
                            className="img-fluid w-100 h-100 p-2"
                            style={{ borderRadius: "15px" }}
                        />
                    </div>
                    <div className="col-md-6 order-1 order-md-2">
                        <h2>
                            <span
                                style={{
                                    WebkitBackgroundClip: "text",
                                    color: "black",
                                    display: "inline-block",
                                    fontWeight: "bolder",
                                }}
                            >
                                Fördelarna med medlemskap
                            </span>
                        </h2>
                        <h3>Förmåner med medlemskap</h3>
                        <p>
                            Med ditt medlemskap får du rätten att använda bilder och videor i dina presentationer eller webbpublikationer utan att ange källan. Detta säkerställer att du inte oavsiktligt marknadsför andra varumärken i ditt arbete. Dessutom går intäkterna från dessa medlemskap till att driva och underhålla denna webbplats. I händelse av ett överskott donerar vi medlen till välgörenhetsorganisationer som Barncancerfonden eller Min Stora Dag för att stödja barn i behov.
                        </p>
                    </div>
                </div>
                <div className="row mt-xl-5">
                    <div className="col-md-6 py-sm-5 ">
                        <h2>  <span

                            style={{
                                WebkitBackgroundClip: "text",
                                color: "black",
                                display: "inline-block",
                                fontWeight: "bold",


                            }}
                        >
                            Vårt åtagande att ge tillbaka
                        </span></h2>
                        <h3>Stöd för välgörenhetsändamål</h3>
                        <p>
                            Vi tror att barn är våra framtida kunder, särskilt när det handlar om att ta körkort. Därför ser vi våra donationer till barnfokuserade välgörenhetsorganisationer som en win-win-situation. När donationer sker visar vi dem öppet på vår webbplats för alla att se. Din medverkan på vår plattform bidrar till denna ädla sak. Välkommen till vår gemenskapens värme!
                        </p>
                    </div>
                    <div className="col-md-6">
                        <img
                            src="https://cdnb.artstation.com/p/marketplace/presentation_assets/002/408/921/large/file.jpg?1675521337"
                            alt="Mission Statement"
                            className="img-fluid w-100 h-100 p-2"
                            style={{ borderRadius: "15px" }}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
