"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { post } from "@/app/api/api";
import { toast } from "react-toastify";
import Logo from "../../public/logo.png";
import ModalImage from "../../public/posteljina.webp";
import Image from "next/image";

const NewsletterModal = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid },
  } = useForm();

  useEffect(() => {
    const hasSubscribed = localStorage.getItem("newsletterSubscribed");

    if (!hasSubscribed) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("newsletterSubscribed", "true");
  };

  const onSubmit = (data) => {
    setError();
    setLoading(true);
    post("/newsletter", { email: data.email })
      .then((response) => {
        reset();
        toast.success(response?.payload?.message, {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        setLoading(false);
        handleClose();
      })
      .catch((error) => {
        console.warn(error);
        setLoading(false);
      });
  };

  const handleError = () => {
    toast.error("Unesite validnu e-mail adresu.", { position: "top-center" });
  };

  return (
    <>
      {show && (
        <div className="fixed bottom-0 right-0 top-0 left-0 max-sm:w-[95%] w-full max-w-xl h-fit m-auto max-h-[80%] overflow-y-auto z-[2002] bg-croonus-2">
          <div className="bg-croonus-4">
            <Image
              src={Logo}
              width={300}
              height={300}
              className="whiteFilter mx-auto py-6"
            />
          </div>
          <div>
            <Image
              src={ModalImage}
              width={300}
              height={300}
              className="object-cover w-full h-[300px]"
            />
          </div>
          <div className="py-10 px-8 flex flex-col items-center gap-4">
            <div className="uppercase font-medium text-3xl">
             
            </div>
            <div className="border-t border-b border-black py-5 w-full text-center"></div>
            {loading ? (
              <div>
                <i className="fa-solid fa-spinner text-[1.1rem] animate-spin"></i>
              </div>
            ) : (
              <form
                className="flex justify-center items-center w-full sm:w-3/4 relative mt-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="email"
                  placeholder="Unesite email adresu"
                  {...register("email", {
                    required: true,
                    validate: {
                      validEmail: (value) =>
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i.test(
                          value.trim(),
                        ),
                    },
                  })}
                  className="w-full py-3 pl-5 pr-[8rem] bg-croonus-2 placeholder:text-croonus-4 border border-croonus-4 self-stretch focus:ring-0 focus:outline-none focus:border-croonus-4"
                />
                <button
                  type="submit"
                  onClick={() => {
                    if (!isValid) handleError();
                  }}
                  className="absolute right-0 bg-croonus-4 w-[7rem] py-3 text-white hover:bg-opacity-80"
                >
                  Prijavite se
                </button>
              </form>
            )}
          </div>
          <div className="text-right pr-4 pb-2"></div>
        </div>
      )}
      {show && (
        <div
          onClick={handleClose}
          className="fixed top-0 left-0 bg-black/70 h-[100dvh] w-[100dvw] z-[2001]"
        />
      )}
    </>
  );
};

export default NewsletterModal;
