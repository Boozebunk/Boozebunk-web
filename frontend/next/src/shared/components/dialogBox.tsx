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
  cancelTextClassName?: string;
  open?: boolean;
  onAction?: () => void;
  onOpenChange?: (open: boolean) => void;
  header?: boolean;
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
  header = true
}: DialogBoxProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={clsx('h-fit w-fit !max-w-[99%] overflow-auto', className)}>
        {header && (
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
        )}
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          {actionText == undefined ? null : (
            <AlertDialogAction onClick={onAction}>{actionText}</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
