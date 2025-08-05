import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import { studentEndpoints } from "../apis";


const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch,
) {
  const toastId = toast.loading("Loading...");
  console.log("token",token)
  try {
    // load the script
    
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
        toast.error("Razorpay SDK failed to load");
    }
    const orderresponse = await apiConnector(
        "POST",
        COURSE_PAYMENT_API,
        { courses },
        {
            Authorization: `Bearer ${token}`,
        }
    );
    if (!orderresponse.data.success) {
        throw new Error(orderresponse.data.message);
    }
    // OPTIONS
     console.log("Making Call")
   console.log(orderresponse)

    const options = {
        key: RAZORPAY_KEY,
        currency: orderresponse.data.message.currency,
        amount: `${orderresponse.data.message.amount}`,
        order_id: orderresponse.data.message.id,
        name: "SkillNest",
        description: "Thanks You For Purchasing course",
        image: rzpLogo,
        prefill: {
            name: `${userDetails.firstName}`,
            email: userDetails.email,
        },
        handler: function (response) {
            // send successfull mail
            sendPaymentSuccessEmail(
                response,
                orderresponse.data.message.amount,
                token
            );
            
            // verify payment
            verifyPayment({ ...response, courses }, token, navigate, dispatch);
        },
    };

    const paymentObject=new window.Razorpay(options)
    paymentObject.open();
    paymentObject.on("payment.failed",function(response){
        toast.error("oops, payment failed")
        console.log("RAZORPAY MODAL ERROR...",response.error)
    })
    // toast.dismiss(toastId)
  } catch (error) {
    console.log("PAYMENT API ERROR", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);

  
}
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("Payment Success Email Error...", error);
  }
}
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Payment Successfull, you are added to course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR...", error);
    toast.error("COuld not verify payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
