import Swal from 'sweetalert2'

export default function alert() {
	Swal.fire({
		icon: 'warning',
		title: 'Are you sure you want to exit the battle?',
		text: 'If you unstake now there will be a 1.5% unstaking fee',
		width: '600',
		height: '465',
		padding: '10',
		confirmButtonText: "Close",
		customClass: {
			container: 'container-class',
			// popup: 'popup-class',
			// header: 'header-class',
			title: 'title-class',
			// text: 'text-class',
			closeButton: 'close-button-class',
			// icon: 'icon-class',
			// image: 'image-class',
			content: 'text-class',
			// input: 'input-class',
			// actions: 'actions-class',
			// confirmButton: 'confirm-button-class',
			// denyButton: 'confirm-button-class',
			// cancelButton: 'cancel-button-class',
			// footer: 'footer-class'
		}
	})
}