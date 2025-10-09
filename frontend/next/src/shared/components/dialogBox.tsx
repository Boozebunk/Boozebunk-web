import clsx from 'clsx';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../shadcn/alert-dialog';

type DialogBoxProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actionText?: string;
  cancelText?: string;
  className?: string;
  customCancelBtn?: string;
  open?: boolean;
  onAction?: () => void;
  onOpenChange?: (open: boolean) => void;
};

export function CustomDialog({
  trigger,
  title,
  description,
  actionText,
  cancelText = 'Cancel',
  onAction,
  children,
  onOpenChange,
  open,
  className,
  customCancelBtn
}: DialogBoxProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent
        className={clsx('h-fit max-h-[90vh] w-fit !max-w-full overflow-auto', className)}>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter className="sticky bottom-0">
          <AlertDialogCancel className={clsx('cursor-pointer', customCancelBtn)}>
            {cancelText}
          </AlertDialogCancel>
          {actionText == undefined ? null : (
            <AlertDialogAction onClick={onAction}>{actionText}</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
