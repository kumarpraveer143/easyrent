import React from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Page,
  PageHeader,
  Card,
  CardBody,
  Button,
  Input,
  Select,
  Textarea,
  Alert,
  money,
} from "../../components/UI";
import { rentRecordSchema } from "../../lib/validation";
import useForm from "../../lib/useForm";

const API = import.meta.env.VITE_API_URL;

const today = () => new Date().toISOString().slice(0, 10);

export default function AddRent() {
  const { relationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const expected = location.state?.rentPrice;

  const { field, values, handleSubmit, submitting, formError } = useForm({
    schema: rentRecordSchema,
    initialValues: {
      rentPaid: expected ? String(expected) : "",
      date: today(),
      paymentMethod: "Cash",
      remarks: "",
    },
    onSubmit: async (data, { setServerErrors }) => {
      try {
        await axios.post(`${API}/history/${relationId}`, data, { withCredentials: true });
        toast.success("Rent recorded.");
        navigate(`/check-history/${relationId}`);
      } catch (err) {
        const body = err.response?.data;
        setServerErrors({
          ...(body?.errors ?? {}),
          ...(body?.errors
            ? {}
            : { _: body?.message ?? "Couldn't record that payment. Try again." }),
        });
      }
    },
  });

  const paid = Number(values.rentPaid);
  const short = expected && Number.isFinite(paid) && paid > 0 && paid < Number(expected);

  return (
    <Page width="narrow">
      <PageHeader
        title="Record a rent payment"
        description="Log rent you've received, so it appears in your tenant's history."
      />

      <form onSubmit={handleSubmit} noValidate>
        {formError && (
          <Alert tone="danger" className="mb-5">
            {formError}
          </Alert>
        )}

        <Card className="mb-5">
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Amount received"
              required
              inputMode="numeric"
              hint={expected ? `Rent for this room is ${money(expected)}` : "In rupees"}
              {...field("rentPaid")}
            />

            {/* A part payment is legitimate — flag it, don't block it. */}
            {short && (
              <Alert tone="warn">
                That&rsquo;s less than the full rent of {money(expected)}. It will be
                recorded as a part payment.
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Date received" type="date" required max={today()} {...field("date")} />
              <Select label="Paid by" required {...field("paymentMethod")}>
                <option value="Cash">Cash</option>
                <option value="Online">Bank transfer / UPI</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <Textarea
              label="Note"
              rows={3}
              hint="Optional — for example which month this covers"
              {...field("remarks")}
            />
          </CardBody>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" loading={submitting}>
            {submitting ? "Recording…" : "Record payment"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </Page>
  );
}
