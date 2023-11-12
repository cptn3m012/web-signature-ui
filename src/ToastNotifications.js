import { toast } from 'react-toastify';

export const successNotifyStorage = () => {
    const content = localStorage.getItem('successNotifyStorage');
    if (content) {
        toast.success(content, {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
}

export const successNotify = (content) => {
    if (content) {
        toast.success(content, {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
}

export const errorNotifyStorage = () => {
    const content = localStorage.getItem('errorNotifyStorage');
    if (content && !toast.isActive('errorNotifyStorage')) {
        toast.error(content, {
            toastId: 'logout',
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "errorToast",
        });
    }
}

export const errorNotify = (content) => {
    if (content) {
        toast.error(content, {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
}