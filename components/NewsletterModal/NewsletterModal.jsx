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
        <div
          className="fixed bottom-4 right-4 max-w-sm w-full max-h-[40vh] bg-croonus-2 overflow-hidden z-[2002] flex flex-col"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <div className="bg-croonus-4 flex justify-center py-4 px-6"></div>

          <div className="flex-shrink-0">
            <Image
              src={ModalImage}
              alt="Modal"
              width={300}
              height={150}
              className="object-cover w-full "
            />
          </div>

          <div className=" flex flex-col items-center gap-2 overflow-hidden w-full">
            <div className="uppercase font-medium text-xl text-center w-full px-6">
              Newsletter prijava
            </div>

            {/* Linija gore */}
            <div className="border-t border-black w-full" />

            {/* Tekst između linija */}
            <p className="text-center text-sm text-black px-2 py-0.1 m-0 leading-tight">
              Uživajte u 10% popusta, u znak dobrodošlice na naš sajt!
            </p>

            {/* Linija dole */}
            <div className="border-b border-black w-full" />

            {loading ? (
              <div>
                <i className="fa-solid fa-spinner text-[1.1rem] animate-spin"></i>
              </div>
            ) : (
              <form
                className="flex w-full mt-2"
                onSubmit={handleSubmit(onSubmit)}
                style={{ paddingLeft: 0, paddingRight: 0 }}
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
                  className="py-2 px-3 bg-croonus-2 placeholder:text-croonus-4 border border-croonus-4 focus:ring-0 focus:outline-none focus:border-croonus-4 text-sm"
                  style={{
                    flex: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRight: "none",
                  }}
                />
                <button
                  type="submit"
                  onClick={() => {
                    if (!isValid) handleError();
                  }}
                  className="bg-croonus-4 py-2 text-white hover:bg-opacity-80 text-sm"
                  style={{
                    flex: 1,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  Prijavite se
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Nema overlay zatamnjenja */}
    </>
  );
};

export default NewsletterModal;
