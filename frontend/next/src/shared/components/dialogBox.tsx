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
  className
}: DialogBoxProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
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
